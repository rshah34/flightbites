import { useState } from 'react';
import PageNavbar from '../components/PageNavbar';
import {
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Slider,
  Box,
} from '@mui/material';
const config = require('../config.json');

export default function FoodTourFlightsPage() {
  // State variables for form inputs, results, loading state, and error handling
  const [originCity, setOriginCity] = useState('');
  const [minStars, setMinStars] = useState(4.5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch food tour flight routes based on user input
  const searchFoodTours = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      origin_city: originCity,
      min_stars: minStars,
    });

    try {
      // Fetch the data from the API
      const response = await fetch(`http://${config.server_host}:${config.server_port}/food-tour-flights?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
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
      <PageNavbar active="food-tour-flights" />

      {/* Main container */}
      <Container sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        {/* Filter box for search inputs */}
        <Box sx={{ width: '100%', p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, mb: 2 }}>
          <Typography variant="h4" gutterBottom>Food Tour Flight Routes</Typography>
          {/* Input fields and sliders */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            {/* Input for Origin City */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Origin City"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
              />
            </Grid>

            {/* Slider for Minimum Restaurant Rating */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Minimum Restaurant Rating</Typography>
              <Slider
                value={minStars}
                min={3.0}
                max={5.0}
                step={0.1}
                onChange={(e, val) => setMinStars(val)}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={searchFoodTours} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Display error message if any */}
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
                  <TableCell>Origin</TableCell>
                  <TableCell>Layover City</TableCell>
                  <TableCell>Final Destination</TableCell>
                  <TableCell>Layover Restaurant</TableCell>
                  <TableCell>Destination Restaurant</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  // Render a row for each result
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{`${row.origin_city}, ${row.origin_state}`}</TableCell>
                      <TableCell>{`${row.layover_city}, ${row.layover_state}`}</TableCell>
                      <TableCell>{`${row.final_destination_city}, ${row.final_destination_state}`}</TableCell>
                      <TableCell>{row.layover_restaurant}</TableCell>
                      <TableCell>{row.destination_restaurant}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Render a message when no results are found
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