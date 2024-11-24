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

module.exports = {
  getTenRestaurants,
};
