import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
const config = require('../config.json');

export default function TopRestaurantCitiesPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchTopCities();
  }, []);

  const fetchTopCities = async () => {
    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/top-cities-with-high-rated-restaurants`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Top Cities for Food Tourism</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>High-Rated Restaurants</TableCell>
              <TableCell>Average Rating</TableCell>
              <TableCell>Average Reviews</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.state}</TableCell>
                <TableCell>{row.high_rating_restaurant_count}</TableCell>
                <TableCell>{row.avg_rating.toFixed(2)}</TableCell>
                <TableCell>{row.avg_reviews}</TableCell>
                <TableCell>{row.weighted_score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}