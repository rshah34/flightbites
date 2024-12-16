const bodyParser = require('body-parser');
const express = require('express');
const routes = require("./routes.js");
const cors = require('cors');
const config = require('./config.json');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/restaurants is registered to the function
// routes.restaurants, specified in routes.js.

app.get('/restaurants', routes.getTenRestaurants);

// Complex Routes
app.get('/layover-restaurants', routes.getLayoverRestaurants);
app.get('/food-tour-flights', routes.getFoodTourFlights);
app.get('/good-restaurant-destinations', routes.getGoodRestaurantDestinations); // Fixed route name
app.get('/three-city-flight-routes', routes.getThreeCityFlightRoutes);
app.get('/top-3-city-flight-paths', routes.getTopThreeCityPaths);
app.get('/top-cities-with-high-rated-restaurants', routes.getTopRestaurantCities);
app.get('/top-cities-with-open-restaurants', routes.getFlightsToCitiesWithOpenRestaurants);
app.get('/multi-leg-flights-with-diverse-dining', routes.getMultiLegFlightsWithDiverseDining);
app.get('/flights-to-cities-with-popular-chains', routes.getPopularChainDestinations);
app.get('/destination-scores', routes.getDestinationScores);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});