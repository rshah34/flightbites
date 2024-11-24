var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */
function getTenRestaurants(req, res) {
  var query = `
    SELECT restaurant_id
    FROM restaurants
    LIMIT 1;
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Database query failed.");
    } else {
      res.json(rows);
    }
  });
}


// The exported functions, which can be accessed in index.js.
module.exports = {
  getTenRestaurants: getTenRestaurants
}