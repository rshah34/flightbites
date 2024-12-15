import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LayoverRestaurantsPage from '../pages/LayoverRestaurantsPage';
import FoodTourFlightsPage from '../pages/FoodTourFlightsPage';
import ThreeCityFlightRoutesPage from '../pages/ThreeCityFlightRoutesPage';
import TopRestaurantCitiesPage from '../pages/TopRestaurantCitiesPage';
import GoodRestaurantDestinationsPage from '../pages/GoodRestaurantDestinationsPage';
import TopThreeCityPathsPage from '../pages/TopThreeCityFlightPathsPage';
import OpenRestaurantsPage from '../pages/OpenRestaurantsPage';
import DiverseLayoversPage from '../pages/DiverseLayoversPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/layover-restaurants" component={LayoverRestaurantsPage} />
        <Route path="/food-tour-flights" component={FoodTourFlightsPage} />
        <Route path="/three-city-flight-routes" component={ThreeCityFlightRoutesPage} />
        <Route path="/top-restaurant-cities" component={TopRestaurantCitiesPage} />
        <Route path="/good-restaurant-destinations" component={GoodRestaurantDestinationsPage} />
		<Route path="/top-3-city-flight-paths" component={TopThreeCityPathsPage} />
        <Route path="/top-cities-with-open-restaurants" component={OpenRestaurantsPage} />
        <Route path="/diverse-dining-layovers" component={DiverseLayoversPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;