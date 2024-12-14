import { useState } from 'react';
import { Container, Slider, Grid } from '@mui/material';
import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function TopRestaurantCitiesPage() {
  const [minStars, setMinStars] = useState(4.0);
  const [minRestaurants, setMinRestaurants] = useState(5);

  const columns = [
    {
      field: 'city',
      headerName: 'City',
      width: 200,
      renderCell: (row) => `${row.city}, ${row.state}`
    },
    {
      field: 'high_rating_restaurant_count',
      headerName: 'High-Rated Restaurants',
      width: 200
    },
    {
      field: 'avg_rating',
      headerName: 'Average Rating',
      width: 150
    },
    {
      field: 'avg_reviews',
      headerName: 'Average Reviews',
      width: 150
    }
  ];

  return (
    <Container>
      <h2>Top Cities for Food Tourism</h2>
      <Grid container spacing={3}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <p>Minimum Number of Restaurants</p>
          <Slider
            value={minRestaurants}
            min={1}
            max={50}
            step={1}
            onChange={(e, val) => setMinRestaurants(val)}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
      <LazyTable
        route={`http://${config.server_host}:${config.server_port}/top-cities-with-high-rated-restaurants?min_stars=${minStars}&min_restaurants=${minRestaurants}`}
        columns={columns}
        defaultPageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Container>
  );
}