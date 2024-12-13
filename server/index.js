const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/restaurants is registered to the function
// routes.restaurants, specified in routes.js.
app.get('/restaurants', routes.getTenRestaurants);

/* ---- (Complex Routes) ---- */
app.get('/layover-restaurants', routes.getLayoverRestaurants);
app.get('/food-tour-flights', routes.getFoodTourFlights);
app.get('/good-restaurants-destinations', routes.getGoodRestaurantDestinations);
app.get('/three-city-flight-routes', routes.getThreeCityFlightRoutes);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});