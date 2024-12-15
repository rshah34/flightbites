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
  Alert 
} from '@mui/material';
const config = require('../config.json');
import PageNavbar from '../components/PageNavbar';

export default function TopRestaurantCitiesPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopCities();
  }, []);

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

  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 2) => {
    if (typeof value === 'number') {
      return value.toFixed(decimals);
    }
    const num = Number(value);
    return isNaN(num) ? '0' : num.toFixed(decimals);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div>
        <PageNavbar active="[PageName]" />
        <Container>
        <Typography variant="h4" gutterBottom>Top Cities for Food Tourism</Typography>
        
        <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell align="right">High-Rated Restaurants</TableCell>
                <TableCell align="right">Average Rating</TableCell>
                <TableCell align="right">Average Reviews</TableCell>
                <TableCell align="right">Score</TableCell>
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
                        {formatNumber(row.avg_rating)}
                    </TableCell>
                    <TableCell align="right">
                        {formatNumber(row.avg_reviews, 0)}
                    </TableCell>
                    <TableCell align="right">
                        {formatNumber(row.weighted_score)}
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
        </Container>
    </div>
  );
}