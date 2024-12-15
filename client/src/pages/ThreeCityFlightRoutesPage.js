import { useState } from 'react';
import { Container, Grid, Slider, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
    CircularProgress, TableRow, Alert } from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');

export default function ThreeCityFlightRoutesPage() {
    const [minStars, setMinStars] = useState(3.5);
    const [minRestaurants, setMinRestaurants] = useState(3);
    const [minDays, setMinDays] = useState(5);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const searchRoutes = async () => {
      setLoading(true);
      setError(null);
  
      const params = new URLSearchParams({
        min_stars: minStars,
        min_restaurants_per_city: minRestaurants,
        min_available_days: minDays
      });
  
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/three-city-flight-routes?${params}`);
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
        <PageNavbar active="three-city-flight-routes" />
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
  
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
  
          {loading ? (
            <CircularProgress />
          ) : (
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
                  {results.length > 0 ? (
                    results.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.start_city || 'N/A'}</TableCell>
                        <TableCell>{row.connection_city || 'N/A'}</TableCell>
                        <TableCell>{row.final_city || 'N/A'}</TableCell>
                        <TableCell>{`${row.origin_good_food || 0} / ${row.connection_good_food || 0} / ${row.destination_good_food || 0}`}</TableCell>
                        <TableCell>{row.available_days || 0}</TableCell>
                        <TableCell>{Number(row.route_score || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No routes found matching the criteria
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