import { useState } from 'react';
import PageNavbar from '../components/PageNavbar';
import {
  Container,
  Grid,
  TextField,
  Slider,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
const config = require('../config.json');
// State variables for form inputs and application state
export default function GoodRestaurantDestinationsPage() {
  const [originCity, setOriginCity] = useState('');
  const [minStars, setMinStars] = useState(4.0);
  const [minRestaurants, setMinRestaurants] = useState(3);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDestinations = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      origin_city: originCity,
      min_stars: minStars,
      min_restaurants: minRestaurants,
    });

    try {
      // Fetch data from the server using the specified query parameters
      const response = await fetch(`http://${config.server_host}:${config.server_port}/good-restaurant-destinations?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation bar */}
      <PageNavbar active="good-restaurant-destinations" />

      {/* Main container */}
      <Container sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        {/* Filter section */}
        <Box sx={{ width: '100%', p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Find Good Restaurant Destinations
          </Typography>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {/* Input for Origin City */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Origin City"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)} // Update originCity state on change
              />
            </Grid>

            {/* Slider for Minimum Restaurant Rating */}
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Minimum Restaurant Rating</Typography>
              <Slider
                value={minStars}
                min={3.0}
                max={5.0}
                step={0.1}
                onChange={(e, val) => setMinStars(val)} // Update minStars state on change
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Slider for Minimum Number of Restaurants */}
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Minimum Number of Restaurants</Typography>
              <Slider
                value={minRestaurants}
                min={1}
                max={20}
                step={1}
                onChange={(e, val) => setMinRestaurants(val)} // Update minRestaurants state on change
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Submit button */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={searchDestinations} disabled={loading}>
                {loading ? 'Searching...' : 'Search'} {/* Dynamic button label */}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Error message */}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Results table */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <TableContainer component={Paper} sx={{ maxHeight: '100%', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {/* Table headers */}
                  <TableCell>Origin City</TableCell>
                  <TableCell>Connection City</TableCell>
                  <TableCell>Final City</TableCell>
                  <TableCell>Restaurants</TableCell>
                  <TableCell>Average Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  // Render a row for each result
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.origin_city}</TableCell>
                      <TableCell>{row.connection_city}</TableCell>
                      <TableCell>{row.final_city}</TableCell>
                      <TableCell>{row.restaurants_at_destination}</TableCell>
                      <TableCell>{row.avg_rating}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Display a message when no results are found
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </div>
  );
}

