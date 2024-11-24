import React, { useState, useEffect } from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';

export default function Dashboard(props) {
  const [restaurants, setRestaurants] = useState([]); // State for restaurant data

  useEffect(() => {
    fetch('http://localhost:8081/restaurants', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        const restaurantDivs = data.map((restaurant, i) => (
          <div key={i} className='restaurant'>
            <div className='restaurant-id'>ID: {restaurant.restaurant_id}</div>
          </div>
        ));

        setRestaurants(restaurantDivs);
      })
      .catch(err => console.error(err));
      console.log('error!!!!')
  }, []);

  return (
    <div className='Dashboard'>
      <PageNavbar active='Dashboard' />
      <div className='container restaurants-container'>
        <br></br>
        <div className='jumbotron less-headspace'>
          <div className='restaurants-container'>
            <h3>Top 10 Restaurant IDs</h3>
            <div className='results-container' id='results'>
              {restaurants} {/* Render restaurant elements */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
