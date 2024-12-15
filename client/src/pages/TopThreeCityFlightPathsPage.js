import { useState, useEffect } from 'react';
import PageNavbar from '../components/PageNavbar';
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
  Alert 
} from '@mui/material';
const config = require('../config.json');

export default function TopThreeCityPathsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopPaths();
  }, []);

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

  if (loading) {
    return (
      <div>
        <PageNavbar active="top-three-city-paths" />
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageNavbar active="top-3-city-flight-paths" />
        <Container>
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <PageNavbar active="top-3-city-flight-paths" />
      <Container>
        <Typography variant="h4" gutterBottom>
          Top Three-City Flight Paths for Food Tourism
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
          Routes with the highest number of highly-rated restaurants
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start City</TableCell>
                <TableCell>Start State</TableCell>
                <TableCell>Connection City</TableCell>
                <TableCell>Connection State</TableCell>
                <TableCell>Final City</TableCell>
                <TableCell>Final State</TableCell>
                <TableCell align="right">Total High-Rated Restaurants</TableCell>
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
      </Container>
    </div>
  );
}