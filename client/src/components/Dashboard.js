// src/components/Dashboard.js
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
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [topCities, routes, layovers] = await Promise.all([
          fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-high-rated-restaurants?limit=5`),
          fetch(`http://${config.server_host}:${config.server_port}/three-city-flight-routes?limit=5`),
          fetch(`http://${config.server_host}:${config.server_port}/layover-restaurants?limit=5`)
        ]);

        const [topCitiesData, routesData, layoversData] = await Promise.all([
          topCities.json(),
          routes.json(),
          layovers.json()
        ]);

        if (mounted) {
          setStats({
            topCities: Array.isArray(topCitiesData) ? topCitiesData : [],
            recentRoutes: Array.isArray(routesData) ? routesData : [],
            popularLayovers: Array.isArray(layoversData) ? layoversData : []
          });
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageNavbar />
        <Typography color="error" sx={{ mt: 4 }}>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <PageNavbar />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Food Cities
                </Typography>
                {stats.topCities && stats.topCities.map((city, idx) => (
                  <Typography key={idx} variant="body2">
                    {city.city}, {city.state} - {city.high_rating_restaurant_count} top restaurants
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Popular Routes
                </Typography>
                {stats.recentRoutes && stats.recentRoutes.map((route, idx) => (
                  <Typography key={idx} variant="body2">
                    {route.city1} → {route.city2} → {route.city3}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Best Layover Cities
                </Typography>
                {stats.popularLayovers && stats.popularLayovers.map((layover, idx) => (
                  <Typography key={idx} variant="body2">
                    {layover.origin_city} → {layover.destination_city} ({layover.restaurant_count} restaurants)
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}