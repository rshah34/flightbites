import { useState } from 'react';
import { Container, Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
const config = require('../config.json');

export default function LayoverRestaurantsPage() {
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [date, setDate] = useState('');
  const [minLayover, setMinLayover] = useState(120);
  const [results, setResults] = useState([]);

  const searchLayovers = async () => {
    const params = new URLSearchParams({
      origin_city: originCity,
      destination_city: destinationCity,
      date: date,
      min_layover_duration: minLayover
    });

    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/layover-restaurants?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Find Restaurants During Layovers</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Origin City"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Destination City"
            value={destinationCity}
            onChange={(e) => setDestinationCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Flight Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Minimum Layover (minutes)"
            value={minLayover}
            onChange={(e) => setMinLayover(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={searchLayovers}>Search</Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Layover City</TableCell>
              <TableCell>Restaurant Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Reviews</TableCell>
              <TableCell>Arrival Time</TableCell>
              <TableCell>Departure Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.layover_city}</TableCell>
                <TableCell>{row.restaurant_name}</TableCell>
                <TableCell>{row.stars}</TableCell>
                <TableCell>{row.review_count}</TableCell>
                <TableCell>{row.arrival_time}</TableCell>
                <TableCell>{row.next_dep_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}