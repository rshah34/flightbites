import React, { useState } from 'react';
import { 
  Container, Grid, Slider, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, CircularProgress, TableRow, Alert, Box, Divider, Button 
} from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');

export default function DestinationPage() {
  // State variables to manage filters, results, loading state, and errors
  const [minTotalRestaurants, setMinTotalRestaurants] = useState(10);
  const [limit, setLimit] = useState(20);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch destination scores from the backend API
  const fetchDestinationScores = async () => {
    setLoading(true);
    setError(null);

    // Construct query parameters based on user inputs
    const params = new URLSearchParams({
      min_total_restaurants: minTotalRestaurants,
      limit
    });

    try {
      // Fetch data from the backend API
      const response = await fetch(`http://${config.server_host}:${config.server_port}/destination-scores?${params}`);
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
      {/* Navbar component for page navigation */}
      <PageNavbar active="destination-scores" />
      <Container sx={{ padding: '2rem' }}>
        {/* Page Header Section */}
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
            Destination Scores
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
          >
            Adjust the filters below to find top-ranked destinations.
          </Typography>
        </Box>

        {/* Filter Controls Section */}
        <Divider sx={{ my: 4, borderColor: 'transparent' }} />
        <Grid container spacing={3} sx={{ mb: 2 }}>
          {/* Filter: Minimum Total Restaurants */}
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
                Minimum Total Restaurants
              </Typography>
              <Slider
                value={minTotalRestaurants}
                min={1}
                max={100}
                step={1}
                onChange={(e, val) => setMinTotalRestaurants(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>

          {/* Filter: Limit Results */}
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
                Limit Results
              </Typography>
              <Slider
                value={limit}
                min={1}
                max={50}
                step={1}
                onChange={(e, val) => setLimit(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Submit Button to trigger API call */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchDestinationScores}
          sx={{ mb: 3, backgroundColor: '#1abc9c', '&:hover': { backgroundColor: '#16a085' } }}
        >
          Submit
        </Button>

        {/* Error Message Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#f8d7da', color: '#721c24' }}>
            {error}
          </Alert>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          // Table to display fetched results
          <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#34495e' }}>
                <TableRow>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>State</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Total Restaurants</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Average Rating</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Good Restaurants</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Total Busy Days</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Destination Score</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Well Connected</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  // Display each row of fetched data
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.dest_city_name}</TableCell>
                      <TableCell>{row.dest_state_name}</TableCell>
                      <TableCell>{row.total_restaurants}</TableCell>
                      <TableCell>{Number(row.avg_rating).toFixed(2)}</TableCell>
                      <TableCell>{row.good_restaurants}</TableCell>
                      <TableCell>{row.total_busy_days}</TableCell>
                      <TableCell>{Number(row.destination_score).toFixed(2)}</TableCell>
                      <TableCell>{row.is_well_connected ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Fallback when no results are available
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No results found. Adjust the filters and try again.
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
