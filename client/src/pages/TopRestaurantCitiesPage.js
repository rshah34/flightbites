import { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, CircularProgress, Alert, Box, Divider 
} from '@mui/material';
const config = require('../config.json');
import PageNavbar from '../components/PageNavbar';

// Default export function for the "Top Cities for Food Tourism" page
export default function TopRestaurantCitiesPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopCities();
  }, []);
  // Function to fetch top cities with high-rated restaurants
  const fetchTopCities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-high-rated-restaurants`);
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
      <PageNavbar active="top-restaurant-cities" />
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
            Top Cities for Food Tourism
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
          >
            Discover cities with the highest concentration of excellent restaurants
          </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'transparent' }} />

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
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>State</TableCell>
                  <TableCell align="right" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>High-Rated Restaurants</TableCell>
                  <TableCell align="right" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Average Rating</TableCell>
                  <TableCell align="right" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Average Reviews</TableCell>
                  <TableCell align="right" sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.city || 'N/A'}</TableCell>
                      <TableCell>{row.state || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {Number(row.high_rating_restaurant_count || 0).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {Number(row.avg_rating || 0).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {Number(row.avg_reviews || 0).toFixed(0)}
                      </TableCell>
                      <TableCell align="right">
                        {Number(row.weighted_score || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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