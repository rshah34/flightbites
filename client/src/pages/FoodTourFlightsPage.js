import { useState } from 'react';
import { Container, Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Slider } from '@mui/material';
const config = require('../config.json');

export default function FoodTourFlightsPage() {
  const [originCity, setOriginCity] = useState('');
  const [minStars, setMinStars] = useState(4.5);
  const [results, setResults] = useState([]);

  const searchFoodTours = async () => {
    const params = new URLSearchParams({
      origin_city: originCity,
      min_stars: minStars
    });

    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/food-tour-flights?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Food Tour Flight Routes</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Origin City"
            value={originCity}
            onChange={(e) => setOriginCity(e.target.value)}
          />
        </Grid>
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
        <Grid item xs={12}>
          <Button variant="contained" onClick={searchFoodTours}>Search</Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Origin</TableCell>
              <TableCell>Layover City</TableCell>
              <TableCell>Final Destination</TableCell>
              <TableCell>Layover Restaurant</TableCell>
              <TableCell>Destination Restaurant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{`${row.origin_city}, ${row.origin_state}`}</TableCell>
                <TableCell>{`${row.layover_city}, ${row.layover_state}`}</TableCell>
                <TableCell>{`${row.final_destination_city}, ${row.final_destination_state}`}</TableCell>
                <TableCell>{row.layover_restaurant}</TableCell>
                <TableCell>{row.destination_restaurant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}