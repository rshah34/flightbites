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
    const {
      origin_city,
      destination_city,
      date,
      min_layover_duration = 120,
      limit = 10,
    } = req.query;

    const query = `
      WITH first_legs AS (
        SELECT
          f1.flight_id AS first_leg,
          f1.flight_date,
          f1.crs_arr_time AS arrival_time,
          oa.city_name AS origin_city,
          da.city_name AS layover_city,
          f1.dest_airport_id
        FROM flights f1
        JOIN airports oa ON f1.origin_airport_id = oa.airport_id
        JOIN airports da ON f1.dest_airport_id = da.airport_id
        WHERE ($1::VARCHAR IS NULL OR oa.city_name = $1)
          AND ($2::DATE IS NULL OR f1.flight_date = $2)
      ),
      second_legs AS (
        SELECT
          f2.flight_id AS second_leg,
          f2.flight_date,
          f2.crs_dep_time AS next_dep_time,
          f2.origin_airport_id,
          da.city_name AS destination_city
        FROM flights f2
        JOIN airports da ON f2.dest_airport_id = da.airport_id
        WHERE ($3::VARCHAR IS NULL OR da.city_name = $3)
      )
      SELECT
        fl.first_leg,
        sl.second_leg,
        fl.layover_city,
        fl.arrival_time,
        sl.next_dep_time,
        r.name AS restaurant_name,
        r.stars,
        r.review_count
      FROM first_legs fl
      JOIN second_legs sl ON fl.dest_airport_id = sl.origin_airport_id
        AND sl.flight_date = fl.flight_date
        AND (sl.next_dep_time - fl.arrival_time) >= $4
      JOIN restaurants r ON fl.layover_city = r.city
      LIMIT $5;
    `;

    const result = await pool.query(query, [
      origin_city || null,
      date || null,
      destination_city || null,
      min_layover_duration,
      limit,
    ]);

    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
}

async function getFoodTourFlights(req, res) {
  const { origin_city, min_stars = 4.5, limit = 10 } = req.query;

  // Initialize parameters with min_stars and limit
  const values = [min_stars];
  let originCityCondition = "";

  if (origin_city) {
    values.push(origin_city);
    originCityCondition = `AND oa.city_name = $${values.length}::VARCHAR`;
  }

  values.push(limit);

  const query = `
  WITH high_rated_restaurants AS (
    SELECT city, state, name
    FROM restaurants
    WHERE stars >= $1 AND is_open = TRUE
  ),
  connecting_flights AS (
    SELECT
      oa.city_name AS origin_city,
      oa.state_name AS origin_state,
      la.city_name AS layover_city,
      la.state_name AS layover_state,
      da.city_name AS final_destination_city,
      da.state_name AS final_destination_state,
      f1.flight_date,
      hr1.name AS layover_restaurant,
      hr2.name AS destination_restaurant
    FROM flights f1
    JOIN airports oa ON f1.origin_airport_id = oa.airport_id
    JOIN airports la ON f1.dest_airport_id = la.airport_id
    JOIN high_rated_restaurants hr1 ON la.city_name = hr1.city AND la.state_name = hr1.state
    JOIN flights f2 ON f1.dest_airport_id = f2.origin_airport_id
                   AND f1.flight_date = f2.flight_date
    JOIN airports da ON f2.dest_airport_id = da.airport_id
    JOIN high_rated_restaurants hr2 ON da.city_name = hr2.city AND da.state_name = hr2.state
    ${originCityCondition}
  )
  SELECT
    origin_city,
    origin_state,
    layover_city,
    layover_state,
    final_destination_city,
    final_destination_state,
    layover_restaurant,
    destination_restaurant
  FROM connecting_flights
  ORDER BY origin_city, final_destination_city
  LIMIT $${values.length};
`;


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
      COUNT(DISTINCT restaurant_id) AS restaurant_count,
      ROUND(AVG(stars), 2) AS avg_rating
    FROM restaurants
    WHERE is_open AND stars >= $1
    GROUP BY city, state
    HAVING COUNT(DISTINCT restaurant_id) >= $2
  ),
  connecting_flights AS (
    SELECT
      oa.city_name AS origin_city,
      ca.city_name AS connection_city,
      da.city_name AS final_city,
      da.state_name AS final_state
    FROM flights f1
    JOIN airports oa ON f1.origin_airport_id = oa.airport_id
    JOIN airports ca ON f1.dest_airport_id = ca.airport_id
    JOIN flights f2 ON f1.dest_airport_id = f2.origin_airport_id
                   AND f1.flight_date = f2.flight_date
    JOIN airports da ON f2.dest_airport_id = da.airport_id
    ${origin_city ? "WHERE oa.city_name = $3::VARCHAR" : ""}
  )
  SELECT
    cf.origin_city,
    cf.connection_city,
    cf.final_city,
    gr.restaurant_count AS restaurants_at_destination,
    gr.avg_rating
  FROM connecting_flights cf
  JOIN good_restaurants gr ON cf.final_city = gr.city AND cf.final_state = gr.state
  ORDER BY gr.avg_rating DESC, gr.restaurant_count DESC
  LIMIT $${origin_city ? 4 : 3};
`;


  // Create the values array dynamically based on whether origin_city is provided
  const values = origin_city
    ? [min_stars, min_restaurants, origin_city, limit]
    : [min_stars, min_restaurants, limit];

  try {
    console.log("Executing query for /good-restaurant-destinations...");
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
    SELECT DISTINCT
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

async function getFlightsToCitiesWithOpenRestaurants(req, res) {
  const {
    min_open_restaurants = 1, 
    min_avg_rating = 3.0
  } = req.query;

  const query = `
    SELECT
      f.flight_id,
      a1.city_name AS origin_city_name,
      a2.city_name AS dest_city_name,
      a2.state_name AS dest_state_name,
      rs.restaurant_count AS open_count,
      COALESCE(rs.avg_rating, 0) AS avg_rating
  FROM flights f
  JOIN airports a1 ON f.origin_airport_id = a1.airport_id
  JOIN airports a2 ON f.dest_airport_id = a2.airport_id
  JOIN mv_restaurant_stats rs ON a2.city_name = rs.city AND a2.state_name = rs.state
  WHERE rs.restaurant_count >= $1 
    AND rs.avg_rating >= $2      
  ORDER BY rs.restaurant_count DESC
  `;

  try {
    console.log("Executing query for //top-cities-with-open-restaurants...");
    const result = await pool.query(query, [min_open_restaurants, min_avg_rating]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({
      error: "Database query failed",
      message: err.message
    });
  }
}

async function getMultiLegFlightsWithDiverseDining(req, res) {
  const {
    min_restaurants = 100,
    min_unique_cuisines = 50,
    min_avg_rating = 3.5,
    min_layover_duration = 120,
    limit = 15
  } = req.query;

  const query = `
    SELECT
        a1.city_name AS origin,
        a2.city_name AS layover_city,
        a3.city_name AS final_city,
        f1.crs_arr_time AS layover_arrival_time,
        f2.crs_dep_time AS next_flight_time,
        f2.crs_dep_time - f1.crs_arr_time AS layover_duration,
        mv.restaurant_count,
        mv.unique_cuisine_types,
        mv.avg_rating
    FROM flights f1
    JOIN flights f2
      ON f1.dest_airport_id = f2.origin_airport_id
      AND f1.flight_date = f2.flight_date
    JOIN airports a1 ON f1.origin_airport_id = a1.airport_id
    JOIN airports a2 ON f1.dest_airport_id = a2.airport_id
    JOIN airports a3 ON f2.dest_airport_id = a3.airport_id
    JOIN mv_layover_diverse_dining mv
      ON a2.city_name = mv.city AND a2.state_name = mv.state
    WHERE mv.restaurant_count >= $1::integer
      AND mv.unique_cuisine_types >= $2::integer
      AND mv.avg_rating >= $3::float
      AND (f2.crs_dep_time - f1.crs_arr_time) >= $4::integer
      AND a3.city_name <> a1.city_name
    LIMIT $5::integer;
  `;

  const values = [
    parseInt(min_restaurants, 10),      
    parseInt(min_unique_cuisines, 10), 
    parseFloat(min_avg_rating),         
    parseInt(min_layover_duration, 10), 
    parseInt(limit, 10)                 
  ];

  try {
    console.log("Executing query for /multi-leg-flights-with-diverse-dining...");
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Database query failed.");
  }
}


module.exports = {
  getTenRestaurants,
  getLayoverRestaurants,
  getFoodTourFlights,
  getGoodRestaurantDestinations,
  getThreeCityFlightRoutes,
  getTopThreeCityPaths,
  getTopRestaurantCities,
  getFlightsToCitiesWithOpenRestaurants,
  getMultiLegFlightsWithDiverseDining
};