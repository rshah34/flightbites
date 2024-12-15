import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
const config = require('../config.json');

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    topCities: [],
    recentRoutes: [],
    popularLayovers: [],
    topThreeCityPaths: [] 
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [topCities, routes, layovers, threeCityPaths] = await Promise.all([
          fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-high-rated-restaurants?limit=5`),
          fetch(`http://${config.server_host}:${config.server_port}/three-city-flight-routes?limit=5`),
          fetch(`http://${config.server_host}:${config.server_port}/layover-restaurants?limit=5`),
          fetch(`http://${config.server_host}:${config.server_port}/top-3-city-flight-paths?limit=5`) 
        ]);

        const [topCitiesData, routesData, layoversData, threeCityPathsData] = await Promise.all([
          topCities.json(),
          routes.json(),
          layovers.json(),
          threeCityPaths.json() 
        ]);

        if (mounted) {
          setStats({
            topCities: Array.isArray(topCitiesData) ? topCitiesData : [],
            recentRoutes: Array.isArray(routesData) ? routesData : [],
            popularLayovers: Array.isArray(layoversData) ? layoversData : [],
            topThreeCityPaths: Array.isArray(threeCityPathsData) ? threeCityPathsData : [] 
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Detailed error:', err);
        if (mounted) {
          console.log('Setting error state to:', err.message);
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
        <Typography color="error" sx={{ mt: 4 }}>
          Error loading dashboard data: {error}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please check the server connection and try again.
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Food Cities
                </Typography>
                {stats.topCities.map((city, idx) => (
                  <Typography key={idx} variant="body2">
                    {city.city}, {city.state} - {city.high_rating_restaurant_count} top restaurants
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Three-City Paths
                </Typography>
                {stats.topThreeCityPaths.map((path, idx) => (
                  <Typography key={idx} variant="body2">
                    {path.start_city}, {path.start_state} → {path.connection_city}, {path.connection_state} → {path.final_city}, {path.final_state} ({path.total_high_rated_restaurants} restaurants)
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Popular Routes
                </Typography>
                {stats.recentRoutes.map((route, idx) => (
                  <Typography key={idx} variant="body2">
                    {route.city1} → {route.city2} → {route.city3}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Best Layover Cities
                </Typography>
                {stats.popularLayovers.map((layover, idx) => (
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