import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import PageNavbar from './PageNavbar';
const config = require('../config.json');

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    topCities: [],
    recentRoutes: [],
    popularLayovers: []
  });

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
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

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