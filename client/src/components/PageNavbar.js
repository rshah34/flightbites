import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PageNavbar() {
  const location = useLocation(); // Hook to get current route

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Layover Restaurants', path: '/layover-restaurants' },
    { name: 'Food Tours', path: '/food-tour-flights' },
    { name: 'Three-City Routes', path: '/three-city-flight-routes' },
    { name: 'Popular chain Destinations', path: '/flights-to-cities-with-popular-chains'},
    { name: 'Destination Scores', path: '/destination-scores' },
    { name: 'Top Cities', path: '/top-restaurant-cities' },
    { name: 'Restaurant Destinations', path: '/good-restaurant-destinations' },
    { name: 'Top 3 City Flight Paths', path: '/top-3-city-flight-paths' },
    { name: 'Open Restaurants', path: '/top-cities-with-open-restaurants' },
    { name: 'Diverse Layovers', path: '/diverse-dining-layovers' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
            }}
          >
            FlightBites
          </Typography>

          {/* Navigation Items */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.path}
                component={RouterLink}
                to={page.path}
                sx={{
                  color: 'white',
                  backgroundColor:
                    location.pathname === page.path
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                  borderRadius: '4px',
                  px: 2,
                  py: 1,
                  fontWeight: location.pathname === page.path ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  textTransform: 'none',
                  transition: 'background-color 0.3s ease',
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}