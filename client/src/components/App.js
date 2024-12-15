import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import LayoverRestaurantsPage from '../pages/LayoverRestaurantsPage';
import FoodTourFlightsPage from '../pages/FoodTourFlightsPage';
import ThreeCityFlightRoutesPage from '../pages/ThreeCityFlightRoutesPage';
import TopRestaurantCitiesPage from '../pages/TopRestaurantCitiesPage';
import GoodRestaurantDestinationsPage from '../pages/GoodRestaurantDestinationsPage';
import TopThreeCityPathsPage from '../pages/TopThreeCityPathsPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/layover-restaurants" component={LayoverRestaurantsPage} />
        <Route path="/food-tour-flights" component={FoodTourFlightsPage} />
        <Route path="/three-city-flight-routes" component={ThreeCityFlightRoutesPage} />
        <Route path="/top-restaurant-cities" component={TopRestaurantCitiesPage} />
        <Route path="/good-restaurant-destinations" component={GoodRestaurantDestinationsPage} />
		<Route path="/top-3-city-flight-paths" component={TopThreeCityPathsPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;