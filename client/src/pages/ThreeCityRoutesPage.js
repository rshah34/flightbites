import { useState } from 'react';
import { Container, Grid, Slider, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
const config = require('../config.json');

export default function ThreeCityRoutesPage() {
  const [minStars, setMinStars] = useState(3.5);
  const [minRestaurants, setMinRestaurants] = useState(3);
  const [minDays, setMinDays] = useState(5);
  const [results, setResults] = useState([]);

  const searchRoutes = async () => {
    const params = new URLSearchParams({
      min_stars: minStars,
      min_restaurants_per_city: minRestaurants,
      min_available_days: minDays
    });

    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/three-city-flight-routes?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Three-City Food Tour Routes</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Minimum Restaurant Rating</Typography>
          <Slider
            value={minStars}
            min={3.0}
            max={5.0}
            step={0.1}
            onChange={(e, val) => setMinStars(val)}
            valueLabelDisplay="auto"
            onChangeCommitted={searchRoutes}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Minimum Restaurants per City</Typography>
          <Slider
            value={minRestaurants}
            min={1}
            max={20}
            step={1}
            onChange={(e, val) => setMinRestaurants(val)}
            valueLabelDisplay="auto"
            onChangeCommitted={searchRoutes}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography gutterBottom>Minimum Available Days</Typography>
          <Slider
            value={minDays}
            min={1}
            max={7}
            step={1}
            onChange={(e, val) => setMinDays(val)}
            valueLabelDisplay="auto"
            onChangeCommitted={searchRoutes}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start City</TableCell>
              <TableCell>Connection City</TableCell>
              <TableCell>Final City</TableCell>
              <TableCell>Good Restaurants</TableCell>
              <TableCell>Available Days</TableCell>
              <TableCell>Route Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.start_city}</TableCell>
                <TableCell>{row.connection_city}</TableCell>
                <TableCell>{row.final_city}</TableCell>
                <TableCell>{`${row.origin_good_food} / ${row.connection_good_food} / ${row.destination_good_food}`}</TableCell>
                <TableCell>{row.available_days}</TableCell>
                <TableCell>{row.route_score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}