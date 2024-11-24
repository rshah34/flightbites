const { Pool } = require('pg');
const config = require('./db-config.js');

const pool = new Pool(config);

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

module.exports = {
  getTenRestaurants,
  getLayoverRestaurants,
  getFoodTourFlights,
  getGoodRestaurantDestinations,
};