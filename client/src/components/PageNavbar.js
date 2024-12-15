import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PageNavbar({ active }) {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Layover Restaurants', path: '/layover-restaurants' },
    { name: 'Food Tours', path: '/food-tour-flights' },
    { name: 'Three-City Routes', path: '/three-city-flight-routes' },
    { name: 'Top Cities', path: '/top-restaurant-cities' },
    { name: 'Restaurant Destinations', path: '/good-restaurant-destinations' },
	{ name: 'Top 3 City Flight Paths', path: '/top-3-city-flight-paths' },
	{ name: 'Open Restaurants', path: '/top-cities-with-open-restaurants' },
	{ name: 'Diverse Layovers', path: '/diverse-dining-layovers' },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FlightBites
          </Typography>
          <div style={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                component={RouterLink}
                to={page.path}
                sx={{
                  color: 'white',
                  display: 'block',
                  backgroundColor: active === page.name ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                {page.name}
              </Button>
            ))}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}