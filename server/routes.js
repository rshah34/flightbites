const config = require('./config.json');
const { Pool } = require('pg');

const pool = new Pool({
  host: config.rds_host,
  port: config.rds_port,
  user: config.rds_user,
  password: config.rds_password,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to database');
    release();
  }
});

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */
async function getTenRestaurants(req, res) {
  const query = `
    SELECT restaurant_id
    FROM restaurants
    LIMIT 10;
  `;

  try {
    console.log("Executing query for /restaurants...");
    const result = await pool.query(query); 
    res.json(result.rows); 
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Database query failed.");
  }
}

async function getLayoverRestaurants(req, res) {
  const {
    origin_city,
    destination_city,
    date,
    min_layover_duration = 120,
    limit = 10,
  } = req.query;

  const query = `
    WITH layover_flights AS (
       SELECT f1.flight_id AS first_leg, f2.flight_id AS second_leg,
              f1.dest_city_name AS layover_city, f1.dest_state_name AS layover_state,
              f1.crs_arr_time AS arrival_time, f2.crs_dep_time AS next_dep_time,
              (f2.crs_dep_time - f1.crs_arr_time) AS layover_duration
       FROM flights f1
       JOIN flights f2 ON f1.dest_city_name = f2.origin_city_name
                     AND f1.dest_state_name = f2.origin_state_name
                     AND f1.flight_date = f2.flight_date
       WHERE (f2.crs_dep_time - f1.crs_arr_time) >= $1
       ${origin_city ? "AND f1.origin_city_name = $2" : ""}
       ${destination_city ? "AND f2.dest_city_name = $3" : ""}
       ${date ? "AND f1.flight_date = $4" : ""}
    )
    SELECT lf.first_leg, lf.second_leg, lf.layover_city, lf.arrival_time, lf.next_dep_time,
          r.name AS restaurant_name, r.stars, r.review_count
    FROM layover_flights lf
    JOIN restaurants r ON lf.layover_city = r.city AND lf.layover_state = r.state
    WHERE r.is_open = TRUE
    ORDER BY lf.layover_city, r.stars DESC
    LIMIT $5;
  `;

  const values = [min_layover_duration, origin_city, destination_city, date, limit].filter(
    (v) => v !== undefined
  );

  try {
    console.log("Executing query for /layover-restaurants...");
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Database query failed.");
  }
}

/* ---- Food Tour Flights ---- */
async function getFoodTourFlights(req, res) {
  const { origin_city, min_stars = 4.5, limit = 10 } = req.query;

  const query = `
    WITH high_rated_restaurants AS (
       SELECT city, state, name
       FROM restaurants
       WHERE stars >= $1 AND is_open = TRUE
    ),
    connecting_flights AS (
        SELECT f1.origin_city_name AS origin_city, f1.origin_state_name AS origin_state,
               f1.dest_city_name AS layover_city, f1.dest_state_name AS layover_state,
               f2.dest_city_name AS final_destination_city, f2.dest_state_name AS final_destination_state,
               f1.flight_date
        FROM flights f1
        JOIN flights f2 ON f1.dest_city_name = f2.origin_city_name
                      AND f1.dest_state_name = f2.origin_state_name
                      AND f1.flight_date = f2.flight_date
        WHERE EXISTS (
            SELECT 1 FROM high_rated_restaurants hr
            WHERE hr.city = f1.dest_city_name AND hr.state = f1.dest_state_name
        ) AND EXISTS (
            SELECT 1 FROM high_rated_restaurants hr
            WHERE hr.city = f2.dest_city_name AND hr.state = f2.dest_state_name
        )
        ${origin_city ? "AND f1.origin_city_name = $2" : ""}
    )
    SELECT cf.origin_city, cf.origin_state, cf.layover_city, cf.layover_state,
          cf.final_destination_city, cf.final_destination_state,
          lr1.name AS layover_restaurant, lr2.name AS destination_restaurant
    FROM connecting_flights cf
    JOIN high_rated_restaurants lr1 ON cf.layover_city = lr1.city AND cf.layover_state = lr1.state
    JOIN high_rated_restaurants lr2 ON cf.final_destination_city = lr2.city AND cf.final_destination_state = lr2.state
    ORDER BY cf.origin_city, cf.final_destination_city
    LIMIT $3;
  `;

  const values = [min_stars, origin_city, limit].filter((v) => v !== undefined);

  try {
    console.log("Executing query for /food-tour-flights...");
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Database query failed.");
  }
}

/* ---- Good Restaurant Destinations ---- */
async function getGoodRestaurantDestinations(req, res) {
  const { origin_city, min_restaurants = 3, min_stars = 4.0, limit = 10 } = req.query;

  const query = `
    WITH good_restaurants AS (
       SELECT
           city,
           state,
           COUNT(DISTINCT restaurant_id) as restaurant_count,
           ROUND(AVG(stars), 2) as avg_rating
       FROM restaurants
       WHERE is_open AND stars >= $1
       GROUP BY city, state
       HAVING COUNT(DISTINCT restaurant_id) >= $2
    ),
    connecting_flights AS (
       SELECT DISTINCT
           f1.origin_city_name,
           f1.dest_city_name,
           f2.dest_city_name as final_city,
           f2.dest_state_name
       FROM flights f1
       JOIN flights f2 ON f1.dest_city_name = f2.origin_city_name
                       AND f1.flight_date = f2.flight_date
       ${origin_city ? "WHERE f1.origin_city_name = $3" : ""}
    )
    SELECT
       cf.origin_city_name as origin_city,
       cf.dest_city_name as connection_city,
       cf.final_city,
       gr.restaurant_count as restaurants_at_destination,
       gr.avg_rating
    FROM connecting_flights cf
    JOIN good_restaurants gr ON cf.final_city = gr.city
                          AND cf.dest_state_name = gr.state
    ORDER BY gr.avg_rating DESC, gr.restaurant_count DESC
    LIMIT $4;
  `;

  const values = [min_stars, min_restaurants, origin_city, limit].filter((v) => v !== undefined);

  try {
    console.log("Executing query for /good-restaurants-destinations...");
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Database query failed.");
  }
}

/* ---- Three-City Flight Routes ---- */
async function getThreeCityFlightRoutes(req, res) {
  const {
    min_restaurants_per_city = 3,
    min_stars = 3.5,
    min_available_days = 5,
    limit = 25
  } = req.query;

  const query = `
    WITH good_restaurants AS (
      -- First, identify cities with sufficient good restaurants
      SELECT 
        city,
        state,
        COUNT(*) as restaurant_count,
        AVG(stars) as avg_rating
      FROM restaurants
      WHERE is_open = true AND stars >= $1
      GROUP BY city, state
      HAVING COUNT(*) >= $2
    ),
    available_routes AS (
      -- Find all possible three-city combinations with flights
      SELECT DISTINCT
        f1.origin_city_name as start_city,
        f1.origin_state_name as start_state,
        f1.dest_city_name as connection_city,
        f1.dest_state_name as connection_state,
        f2.dest_city_name as final_city,
        f2.dest_state_name as final_state,
        COUNT(DISTINCT f1.flight_date) as available_days,
        COUNT(DISTINCT f1.flight_id || '-' || f2.flight_id) as route_options
      FROM flights f1
      JOIN flights f2 
        ON f1.dest_city_name = f2.origin_city_name
        AND f1.dest_state_name = f2.origin_state_name
        AND f1.flight_date = f2.flight_date
      GROUP BY 
        f1.origin_city_name, f1.origin_state_name,
        f1.dest_city_name, f1.dest_state_name,
        f2.dest_city_name, f2.dest_state_name
      HAVING COUNT(DISTINCT f1.flight_date) >= $3
    )
    SELECT 
      ar.start_city,
      ar.start_state,
      ar.connection_city,
      ar.connection_state,
      ar.final_city,
      ar.final_state,
      gr1.restaurant_count as origin_good_food,
      gr2.restaurant_count as connection_good_food,
      gr3.restaurant_count as destination_good_food,
      ar.available_days,
      ar.route_options,
      ROUND(AVG(gr1.avg_rating + gr2.avg_rating + gr3.avg_rating)/3, 2) as route_avg_rating,
      -- Calculate route score based on restaurants and flight availability
      ROUND(
        (gr1.restaurant_count + gr2.restaurant_count + gr3.restaurant_count) * 
        (ar.available_days/7.0) * 
        ((gr1.avg_rating + gr2.avg_rating + gr3.avg_rating)/3) * 
        LOG(ar.route_options + 1), 
        2
      ) as route_score
    FROM available_routes ar
    JOIN good_restaurants gr1 
      ON ar.start_city = gr1.city AND ar.start_state = gr1.state
    JOIN good_restaurants gr2 
      ON ar.connection_city = gr2.city AND ar.connection_state = gr2.state
    JOIN good_restaurants gr3 
      ON ar.final_city = gr3.city AND ar.final_state = gr3.state
    ORDER BY route_score DESC
    LIMIT $4;
  `;

  const values = [min_stars, min_restaurants_per_city, min_available_days, limit];

  try {
    console.log("Executing query for /three-city-flight-routes...");
    console.log("Parameters:", values);
    
    const result = await pool.query(query, values);
    
    // Transform the results to match the specified response format
    const formattedResults = result.rows.map(row => ({
      start_city: row.start_city,
      connection_city: row.connection_city,
      final_city: row.final_city,
      origin_good_food: row.origin_good_food,
      connection_good_food: row.connection_good_food,
      destination_good_food: row.destination_good_food,
      available_days: row.available_days,
      route_options: row.route_options,
      route_avg_rating: row.route_avg_rating,
      route_score: row.route_score
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Database query failed:", err);
    console.error("Error details:", err.message);
    res.status(500).json({
      error: "Database query failed",
      message: err.message
    });
  }
}

/* ---- Top Three-City Paths by High-Rated Restaurants ---- */
async function getTopThreeCityPaths(req, res) {
  const {
    limit = 25
  } = req.query;

  const query = `
    SELECT 
      a1.city_name as start_city,
      a1.state_name as start_state,
      a2.city_name as connection_city,
      a2.state_name as connection_state,
      a3.city_name as final_city,
      a3.state_name as final_state,
      a1.high_rated_count + a2.high_rated_count + a3.high_rated_count as total_high_rated_restaurants
    FROM flights f1
    JOIN flights f2 
      ON f1.dest_airport_id = f2.origin_airport_id
      AND f1.flight_date = f2.flight_date
    JOIN mv_high_rated_cities a1 ON f1.origin_airport_id = a1.airport_id
    JOIN mv_high_rated_cities a2 ON f1.dest_airport_id = a2.airport_id
    JOIN mv_high_rated_cities a3 ON f2.dest_airport_id = a3.airport_id
    ORDER BY total_high_rated_restaurants DESC
    LIMIT $1;
  `;

  try {
    console.log("Executing query for /top-3-city-flight-paths...");
    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({
      error: "Database query failed",
      message: err.message
    });
  }
}

/* ---- Top Cities with High-Rated Restaurants ---- */
async function getTopRestaurantCities(req, res) {
  const {
    limit = 10
  } = req.query;

  const query = `
    SELECT 
      city,
      state,
      high_rating_count as high_rating_restaurant_count,
      avg_rating,
      avg_reviews,
      ROUND(
        (avg_rating * high_rating_count * LOG(avg_reviews + 1))::numeric,
        2
      ) as weighted_score
    FROM mv_restaurant_stats
    ORDER BY weighted_score DESC
    LIMIT $1;
  `;

  try {
    console.log("Executing query for /top-cities-with-high-rated-restaurants...");
    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({
      error: "Database query failed",
      message: err.message
    });
  }
}

module.exports = {
  getTenRestaurants,
  getLayoverRestaurants,
  getFoodTourFlights,
  getGoodRestaurantDestinations,
  getThreeCityFlightRoutes,
  getTopThreeCityPaths,
  getTopRestaurantCities
};