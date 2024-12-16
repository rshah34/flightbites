import React, { useState } from 'react';
import { 
  Container, Grid, Button, Slider, Typography, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  CircularProgress, Alert, Box, Divider 
} from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');

export default function DiverseLayoversPage() {
  // State variables to manage filters, results, loading state, and errors
  const [minLayoverDuration, setMinLayoverDuration] = useState(180); // Default: 180 minutes
  const [minUniqueCuisines, setMinUniqueCuisines] = useState(50); // Default: 50 cuisines
  const [minRestaurants, setMinRestaurants] = useState(100); // Default: 100 restaurants
  const [minAvgRating, setMinAvgRating] = useState(3.0); // Default: 3.0 stars
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // Fetches flights with layovers offering diverse dining options based on user filters
  const searchFlights = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      min_layover_duration: minLayoverDuration,
      min_unique_cuisines: minUniqueCuisines,
      min_restaurants: minRestaurants,
      min_avg_rating: minAvgRating,
    });

    try {
      // Fetch data from the backend API
      const response = await fetch(`http://${config.server_host}:${config.server_port}/multi-leg-flights-with-diverse-dining?${params}`);
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
      {/* Page header with navbar */}
      <PageNavbar active="diverse-dining-layovers" />
      <Container sx={{ padding: '2rem' }}>
        {/* Title Box */}
        <Box 
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: '1rem 2rem', 
            borderRadius: '8px', 
            maxWidth: '600px', 
            margin: '0 auto', 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
            textAlign: 'center', 
            mb: 4 
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: '#2c3e50', letterSpacing: '0.1rem' }}
          >
            Diverse Dining Layovers
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
          >
            Use the sliders below to adjust the parameters for your search and click "Submit" to find multi-leg flights with layovers offering diverse dining options.
          </Typography>
        </Box>

        {/* Filter Sliders Section */}
        <Divider sx={{ my: 4, borderColor: 'transparent' }} />
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {/* Minimum Layover Duration Slider */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Layover Duration (minutes)
              </Typography>
              <Slider
                value={minLayoverDuration}
                min={60}
                max={600}
                step={15}
                onChange={(e, val) => setMinLayoverDuration(val)} 
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>

          {/* Minimum Unique Cuisine Types Slider */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Unique Cuisine Types
              </Typography>
              <Slider
                value={minUniqueCuisines}
                min={50}
                max={250}
                step={10}
                onChange={(e, val) => setMinUniqueCuisines(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>

          {/* Minimum Restaurants Slider */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Restaurants
              </Typography>
              <Slider
                value={minRestaurants}
                min={100}
                max={4000}
                step={100}
                onChange={(e, val) => setMinRestaurants(val)} 
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>

          {/* Minimum Average Rating Slider */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
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
          onClick={searchFlights}
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

        {/* Loading Indicator and Results Table */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#34495e', color: '#ecf0f1' }}>
                <TableRow>
                  {['Origin', 'Layover City', 'Final City', 'Layover Arrival Time', 'Next Flight Time', 'Layover Duration (min)', 'Restaurants', 'Cuisine Types', 'Average Rating'].map((header) => (
                    <TableCell key={header} align="center" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell align="center">{row.origin || 'N/A'}</TableCell>
                      <TableCell align="center">{row.layover_city || 'N/A'}</TableCell>
                      <TableCell align="center">{row.final_city || 'N/A'}</TableCell>
                      <TableCell align="center">{row.layover_arrival_time || 'N/A'}</TableCell>
                      <TableCell align="center">{row.next_flight_time || 'N/A'}</TableCell>
                      <TableCell align="center">{row.layover_duration || 'N/A'}</TableCell>
                      <TableCell align="center">{row.restaurant_count || 0}</TableCell>
                      <TableCell align="center">{row.unique_cuisine_types || 0}</TableCell>
                      <TableCell align="center">{row.avg_rating || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
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
