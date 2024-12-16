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
  Alert,
  CircularProgress,
  Box, 
} from '@mui/material';
const config = require('../config.json');
// State variables for form inputs and application state
export default function LayoverRestaurantsPage() {
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [minLayover, setMinLayover] = useState(120);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch layover restaurant data
  const searchLayovers = async () => {
    setLoading(true);
    setError(null);
    
    const params = new URLSearchParams({
      origin_city: originCity,
      destination_city: destinationCity,
      min_layover_duration: minLayover
    });

    try {
      // Fetch data from the server
      const response = await fetch(`http://${config.server_host}:${config.server_port}/layover-restaurants?${params}`);
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
      {/* Navigation bar */}
      <PageNavbar active="layover-restaurants" />

      {/* Main container */}
      <Container sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        {/* Form section for user inputs */}
        <Box sx={{ width: '100%', p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2, mb: 4 }}>
          <Typography variant="h4" gutterBottom>Find Restaurants During Layovers</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Input for Origin City */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Origin City"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)} // Update origin city state
              />
            </Grid>

            {/* Input for Destination City */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Destination City"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)} // Update destination city state
              />
            </Grid>

            {/* Input for Minimum Layover Duration */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Layover (minutes)"
                value={minLayover}
                onChange={(e) => setMinLayover(e.target.value)} // Update layover duration state
              />
            </Grid>

            {/* Search Button */}
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={searchLayovers} 
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Searching...' : 'Search'} {/* Show loading state in button */}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading ? (
          <CircularProgress />
        ) : (
          // Results table
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {/* Table headers */}
                  <TableCell>Layover City</TableCell>
                  <TableCell>Restaurant Name</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Reviews</TableCell>
                  <TableCell>Arrival Time</TableCell>
                  <TableCell>Departure Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  // Render a row for each result
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.layover_city}</TableCell>
                      <TableCell>{row.restaurant_name}</TableCell>
                      <TableCell>{row.stars}</TableCell>
                      <TableCell>{row.review_count}</TableCell>
                      <TableCell>{row.arrival_time}</TableCell>
                      <TableCell>{row.next_dep_time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // Show a message if no results are found
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No results found
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