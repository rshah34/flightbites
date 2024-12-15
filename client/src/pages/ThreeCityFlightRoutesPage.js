import { useState } from 'react';
import { 
  Container, Grid, Slider, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, CircularProgress, TableRow, Alert, Box, Divider, Button 
} from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');

export default function ThreeCityFlightRoutesPage() {
  const [minStars, setMinStars] = useState(3.5);
  const [minRestaurants, setMinRestaurants] = useState(3);
  const [minDays, setMinDays] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRoutes = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      min_stars: minStars,
      min_restaurants_per_city: minRestaurants,
      min_available_days: minDays
    });

    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/three-city-flight-routes?${params}`);
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
      <PageNavbar active="three-city-flight-routes" />
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
            Three-City Food Tour Routes
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
          >
            Use the sliders below to find the perfect three-city food tour route
          </Typography>
        </Box>

        {/* Sliders Section */}
        <Divider sx={{ my: 4, borderColor: 'transparent' }} />
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Restaurant Rating
              </Typography>
              <Slider
                value={minStars}
                min={3.0}
                max={5.0}
                step={0.1}
                onChange={(e, val) => setMinStars(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Restaurants per City
              </Typography>
              <Slider
                value={minRestaurants}
                min={1}
                max={20}
                step={1}
                onChange={(e, val) => setMinRestaurants(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Available Days
              </Typography>
              <Slider
                value={minDays}
                min={1}
                max={7}
                step={1}
                onChange={(e, val) => setMinDays(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={searchRoutes}
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
              <TableHead sx={{ backgroundColor: '#34495e' }}>
                <TableRow>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Start City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Connection City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Final City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Good Restaurants</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Available Days</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Route Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.start_city || 'N/A'}</TableCell>
                      <TableCell>{row.connection_city || 'N/A'}</TableCell>
                      <TableCell>{row.final_city || 'N/A'}</TableCell>
                      <TableCell>{`${row.origin_good_food || 0} / ${row.connection_good_food || 0} / ${row.destination_good_food || 0}`}</TableCell>
                      <TableCell>{row.available_days || 0}</TableCell>
                      <TableCell>{Number(row.route_score || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No routes found matching the criteria
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