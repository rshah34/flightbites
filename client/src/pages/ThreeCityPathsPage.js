import { useState } from 'react';
import { Container, Slider, Grid } from '@mui/material';
import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function ThreeCityPathsPage() {
  const [minStars, setMinStars] = useState(4.0);
  const [minRestaurants, setMinRestaurants] = useState(3);
  const [minDays, setMinDays] = useState(5);

  const columns = [
    {
      field: 'start_city',
      headerName: 'Starting City',
      width: 200,
      renderCell: (row) => `${row.start_city}, ${row.start_state}`
    },
    {
      field: 'connection_city',
      headerName: 'Layover City',
      width: 200,
      renderCell: (row) => `${row.connection_city}, ${row.connection_state}`
    },
    {
      field: 'final_city',
      headerName: 'Destination',
      width: 200,
      renderCell: (row) => `${row.final_city}, ${row.final_state}`
    },
    {
      field: 'origin_good_food',
      headerName: 'Origin Restaurants',
      width: 150
    },
    {
      field: 'connection_good_food',
      headerName: 'Layover Restaurants',
      width: 150
    },
    {
      field: 'destination_good_food',
      headerName: 'Destination Restaurants',
      width: 150
    },
    {
      field: 'route_score',
      headerName: 'Route Score',
      width: 120
    }
  ];

  return (
    <Container>
      <h2>Find Three-City Food Tourism Routes</h2>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <p>Minimum Restaurant Rating</p>
          <Slider
            value={minStars}
            min={3.0}
            max={5.0}
            step={0.1}
            onChange={(e, val) => setMinStars(val)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={4}>
          <p>Minimum Restaurants per City</p>
          <Slider
            value={minRestaurants}
            min={1}
            max={20}
            step={1}
            onChange={(e, val) => setMinRestaurants(val)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={4}>
          <p>Minimum Available Days</p>
          <Slider
            value={minDays}
            min={1}
            max={7}
            step={1}
            onChange={(e, val) => setMinDays(val)}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top-3-city-flight-paths-by-high-rated-restaurants?min_stars=${minStars}&min_restaurants_per_city=${minRestaurants}&min_available_days=${minDays}`}
        columns={columns}
        defaultPageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Container>
  );
}