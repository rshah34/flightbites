import { useState } from 'react';
import PageNavbar from '../components/PageNavbar';
import { Container, Grid, TextField, Slider, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
const config = require('../config.json');

export default function GoodRestaurantDestinationsPage() {
  const [originCity, setOriginCity] = useState('');
  const [minStars, setMinStars] = useState(4.0);
  const [minRestaurants, setMinRestaurants] = useState(3);
  const [results, setResults] = useState([]);

  const searchDestinations = async () => {
    const params = new URLSearchParams({
      origin_city: originCity,
      min_stars: minStars,
      min_restaurants: minRestaurants
    });

    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/good-restaurant-destinations?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <PageNavbar active="[PageName]" />
      <Container>
        <Typography variant="h4" gutterBottom>Find Good Restaurant Destinations</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Origin City"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Minimum Number of Restaurants</Typography>
            <Slider
              value={minRestaurants}
              min={1}
              max={20}
              step={1}
              onChange={(e, val) => setMinRestaurants(val)}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={searchDestinations}>Search</Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Origin City</TableCell>
                <TableCell>Connection City</TableCell>
                <TableCell>Final City</TableCell>
                <TableCell>Restaurants</TableCell>
                <TableCell>Average Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.origin_city}</TableCell>
                  <TableCell>{row.connection_city}</TableCell>
                  <TableCell>{row.final_city}</TableCell>
                  <TableCell>{row.restaurants_at_destination}</TableCell>
                  <TableCell>{row.avg_rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}