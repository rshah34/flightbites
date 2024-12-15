import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
const config = require('../config.json');

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    topCities: [],
    highOpenRestaurants: [],
    topThreeCityPaths: [] 
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [topCities, openRestaurants, threeCityPaths] = await Promise.all([
          fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-high-rated-restaurants?limit=5`),
          fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-open-restaurants?min_open_restaurants=100&min_avg_rating=3.0`),
          fetch(`http://${config.server_host}:${config.server_port}/top-3-city-flight-paths?limit=5`) 
        ]);

        const [topCitiesData, openData, threeCityPathsData] = await Promise.all([
          topCities.json(),
          openRestaurants.json(),
          threeCityPaths.json() 
        ]);

        if (mounted) {
          setStats({
            topCities: Array.isArray(topCitiesData) ? topCitiesData : [],
            highOpenRestaurants: Array.isArray(openData) ? openData : [],
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
        {/* Top Food Cities */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  backgroundColor: '#ffccbc',
                  color: '#37474f',
                  padding: '0.5rem',
                  textAlign: 'center',
                  borderRadius: '4px',
                  mb: 2
                }}
              >
                Top Food Cities
              </Typography>
              {stats.topCities.map((city, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ textAlign: 'center' }} 
                >
                  {city.city}, {city.state} - {city.high_rating_restaurant_count} top restaurants
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>


        {/* Flights to Cities with Open Restaurants */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  backgroundColor: '#b3e5fc',
                  color: '#01579b',
                  padding: '0.5rem',
                  textAlign: 'center',
                  borderRadius: '4px',
                  mb: 2
                }}
              >
                Flights to Cities with Most Open Restaurants
              </Typography>
              {(() => {
                const uniqueDestCities = new Set();
                const filteredRoutes = stats.highOpenRestaurants.filter((route) => {
                  if (!uniqueDestCities.has(route.dest_city_name)) {
                    uniqueDestCities.add(route.dest_city_name);
                    return true;
                  }
                  return false;
                });

                return filteredRoutes.map((route, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{ textAlign: 'center' }} 
                  >
                    {route.origin_city_name} → {route.dest_city_name} ({route.open_count} open)
                  </Typography>
                ));
              })()}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Three-City Paths */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  backgroundColor: '#c5e1a5',
                  color: '#2e7d32',
                  padding: '0.5rem',
                  textAlign: 'center',
                  borderRadius: '4px',
                  mb: 2
                }}
              >
                Top Three-City Paths
              </Typography>
              {stats.topThreeCityPaths.map((path, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  sx={{ textAlign: 'center' }}
                >
                  {path.start_city}, {path.start_state} → {path.connection_city}, {path.connection_state} → {path.final_city}, {path.final_state} ({path.total_high_rated_restaurants} restaurants)
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