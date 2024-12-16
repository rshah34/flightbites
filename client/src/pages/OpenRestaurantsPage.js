import React, { useState } from 'react';
import { Container, Grid, Button, Slider, Typography, Paper, Table, Divider, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Box } from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');

// Default export function for the "Open Restaurants Page"
export default function OpenRestaurantsPage() {
  const [minOpenRestaurants, setMinOpenRestaurants] = useState(1);
  const [minAvgRating, setMinAvgRating] = useState(3.0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch open restaurant data from the server 
  const searchRestaurants = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      min_open_restaurants: minOpenRestaurants,
      min_avg_rating: minAvgRating,
    });

    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-open-restaurants?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageNavbar active="top-cities-with-open-restaurants" />
      <Container sx={{ padding: '2rem' }}>
        {/* Page Title */}
        {/* Page Title with Background */}
        <Box sx={{ 
            textAlign: 'center', 
            mb: 4, 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: '1rem 2rem', 
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
        <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: '#2c3e50', letterSpacing: '0.1rem' }}
        >
            Flights to Cities with Open Restaurants
        </Typography>
        <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
        >
            Adjust the parameters below and click "Submit" to find flights to cities with open restaurants.
        </Typography>
        </Box>


        {/* Sliders for Parameters */}
        {/* Sliders Section */}
        <Divider sx={{ my: 4, borderColor: 'transparent'}} />
        <Grid container spacing={3} sx={{ mb: 2 }}>
        {/* Minimum Open Restaurants Slider */}
        <Grid item xs={12} md={6}>
            <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
            <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Open Restaurants
            </Typography>
            <Slider
                value={minOpenRestaurants}
                min={100}
                max={4000}
                step={100}
                onChange={(e, val) => setMinOpenRestaurants(val)}
                valueLabelDisplay="auto"
            />
            </Box>
        </Grid>

        {/* Minimum Average Rating Slider */}
        <Grid item xs={12} md={6}>
            <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
            <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Average Rating
            </Typography>
            <Slider
                value={minAvgRating}
                min={1.0}
                max={5.0}
                step={0.05}
                onChange={(e, val) => setMinAvgRating(val)}
                valueLabelDisplay="auto"
            />
            </Box>
        </Grid>
        </Grid>


        {/* Submit Button */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={searchRestaurants}
          sx={{ mb: 3, backgroundColor: '#1abc9c', '&:hover': { backgroundColor: '#16a085' } }}
        >
          Submit
        </Button>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#f8d7da', color: '#721c24' }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#34495e', color: '#ecf0f1' }}>
                <TableRow>
                  {['Flight ID', 'Origin City', 'Destination City', 'Destination State', 'Open Restaurants', 'Average Rating'].map((header) => (
                    <TableCell key={header} sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  (() => {
                    const uniqueDestCities = new Set();
                    const filteredResults = results.filter((row) => {
                      if (!uniqueDestCities.has(row.dest_city_name)) {
                        uniqueDestCities.add(row.dest_city_name);
                        return true;
                      }
                      return false;
                    });

                    return filteredResults.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.flight_id || 'N/A'}</TableCell>
                        <TableCell>{row.origin_city_name || 'N/A'}</TableCell>
                        <TableCell>{row.dest_city_name || 'N/A'}</TableCell>
                        <TableCell>{row.dest_state_name || 'N/A'}</TableCell>
                        <TableCell>{row.open_count || 0}</TableCell>
                        <TableCell>{row.avg_rating ? row.avg_rating : 'N/A'}</TableCell>
                      </TableRow>
                    ));
                  })()
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No results found. Adjust the parameters and try again.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
}
