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
  try {
    const { limit = 5 } = req.query;
    const query = `
      SELECT DISTINCT 
        f.origin_city_name as origin_city,
        f.dest_city_name as destination_city,
        COUNT(r.restaurant_id) as restaurant_count
      FROM flights f
      JOIN restaurants r ON f.dest_city_name = r.city
      GROUP BY f.origin_city_name, f.dest_city_name
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

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
  try {
    const { limit = 5 } = req.query;
    const query = `
      SELECT DISTINCT 
        f1.origin_city_name as city1,
        f1.dest_city_name as city2,
        f2.dest_city_name as city3
      FROM flights f1
      JOIN flights f2 ON f1.dest_city_name = f2.origin_city_name
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

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