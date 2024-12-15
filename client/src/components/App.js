import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import LayoverRestaurantsPage from '../pages/LayoverRestaurantsPage';
import FoodTourFlightsPage from '../pages/FoodTourFlightsPage';
import ThreeCityRoutesPage from '../pages/ThreeCityRoutesPage';
import TopRestaurantCitiesPage from '../pages/TopRestaurantCitiesPage';
import GoodRestaurantDestinationsPage from '../pages/GoodRestaurantDestinationsPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/layover-restaurants" component={LayoverRestaurantsPage} />
        <Route path="/food-tour-flights" component={FoodTourFlightsPage} />
        <Route path="/three-city-routes" component={ThreeCityRoutesPage} />
        <Route path="/top-restaurant-cities" component={TopRestaurantCitiesPage} />
        <Route path="/good-restaurant-destinations" component={GoodRestaurantDestinationsPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;