import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  Box,
  Divider
} from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');
// Default export function for the "Top Three City Flight Paths" page
export default function TopThreeCityPathsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopPaths();
  }, []);
  // Function to fetch top cities with best 3-city paths in terms of highly rated restaurants
  const fetchTopPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${config.server_host}:${config.server_port}/top-3-city-flight-paths`);
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
      <PageNavbar active="top-3-city-flight-paths" />
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
            Top Three-City Flight Paths
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
          >
            Routes with the highest number of highly-rated restaurants
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
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Start City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Start State</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Connection City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Connection State</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Final City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Final State</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }} align="right">Total High-Rated Restaurants</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.start_city || 'N/A'}</TableCell>
                      <TableCell>{row.start_state || 'N/A'}</TableCell>
                      <TableCell>{row.connection_city || 'N/A'}</TableCell>
                      <TableCell>{row.connection_state || 'N/A'}</TableCell>
                      <TableCell>{row.final_city || 'N/A'}</TableCell>
                      <TableCell>{row.final_state || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {Number(row.total_high_rated_restaurants || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No routes found
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