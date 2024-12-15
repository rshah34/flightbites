import React, { useState } from 'react';
import { Container, Grid, Button, Slider, Typography, Paper, Table, Divider, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Box } from '@mui/material';
import PageNavbar from '../components/PageNavbar';
const config = require('../config.json');

export default function PopularChainDestination() {
  const [minChainCount, setMinChainCount] = useState(3);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDestinations = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      min_chain_count: minChainCount,
    });

    try {
        console.log("Got here", `http://${config.server_host}:${config.server_port}/flights-to-cities-with-popular-chains?${params}`)
      const response = await fetch(`http://${config.server_host}:${config.server_port}/flights-to-cities-with-popular-chains?${params}`);
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
      <PageNavbar active="flights-to-cities-with-popular-chains" />
      <Container sx={{ padding: '2rem' }}>
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4, 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: '1rem 2rem', 
            borderRadius: '8px', 
            maxWidth: '600px', 
            margin: '0 auto', 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' 
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: '#2c3e50', letterSpacing: '0.1rem' }}
          >
            Flights to Cities with Popular Chains
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontSize: '1.1rem', color: '#34495e' }}
          >
            Find flights to cities with the most popular restaurant chains.
          </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'transparent' }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '1rem', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Minimum Chain Count
              </Typography>
              <Slider
                value={minChainCount}
                min={1}
                max={50}
                step={1}
                onChange={(e, val) => setMinChainCount(val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Grid>
        </Grid>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={searchDestinations} 
          sx={{ mt: 3, backgroundColor: '#1abc9c', '&:hover': { backgroundColor: '#16a085' } }}
        >
          Submit
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2, backgroundColor: '#f8d7da', color: '#721c24' }}>{error}</Alert>}
        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#34495e' }}>
                <TableRow>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Flight ID</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Origin City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Destination City</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Destination State</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Popular Chain</TableCell>
                  <TableCell sx={{ color: '#ecf0f1', fontWeight: 'bold' }}>Location Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length > 0 ? (
                  results.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.flight_id}</TableCell>
                      <TableCell>{row.origin_city_name}</TableCell>
                      <TableCell>{row.dest_city_name}</TableCell>
                      <TableCell>{row.dest_state_name}</TableCell>
                      <TableCell>{row.popular_chain}</TableCell>
                      <TableCell>{row.count_in_city}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No results found</TableCell>
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
