import { useHistory } from 'react-router-dom'; 
import { Container, Grid, Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import PageNavbar from '../components/PageNavbar';
import Dashboard from '../components/Dashboard';

export default function HomePage() {
  const history = useHistory();

  const queryGroups = [
    {
      title: "Restaurant Discovery",
      description: "Find top-rated restaurants across different cities",
      routes: [
        {
          name: "Top Restaurant Cities",
          path: "/top-cities-with-high-rated-restaurants",
          description: "Discover cities with the highest concentration of good restaurants",
          implemented: true
        },
        {
          name: "Top Three-City Paths",
          path: "/top-3-city-flight-paths",
          description: "Find the best three-city routes with high-rated restaurants",
          implemented: true
        },
        {
          name: "Popular Chain Destination",
          path: "/flights-to-cities-with-popular-chains",
          description: "Find flights to cities with popular restaurant chains",
          implemented: true
        },
        {
          name: "Destination Scores",
          path: "/destination-scores",
          description: "Ranked cities based on a score combining flights and restaurants",
          implemented: true
        }
      ]
    },
    {
      title: "Multi-City Food Tours",
      description: "Plan multi-city trips based on restaurant quality",
      routes: [
        {
          name: "Three-City Food Routes",
          path: "/three-city-flight-routes",
          description: "Find optimal three-city routes with great restaurants",
          implemented: true
        },
        {
          name: "Food Tour Flights",
          path: "/food-tour-flights",
          description: "Find flights connecting cities with good restaurants",
          implemented: true
        },
        {
          name: "Diverse Dining Layovers",
          path: "/diverse-dining-layovers",
          description: "Find layover cities for connecting flights with diverse dining options",
          implemented: true
        }
      ]
    },
    {
      title: "Restaurant-Based Travel Planning",
      description: "Plan your travel around great food experiences",
      routes: [
        {
          name: "Layover Restaurants",
          path: "/layover-restaurants",
          description: "Find good restaurants during layovers",
          implemented: true
        },
        {
          name: "Good Restaurant Destinations",
          path: "/good-restaurant-destinations",
          description: "Find destinations with high concentrations of good restaurants",
          implemented: true
        },
        {
          name: "Many Open Restaurants",
          path: "/top-cities-with-open-restaurants",
          description: "Find destinations with a high number of open restaurants",
          implemented: true
        }
      ]
    }
  ];

  return (
    <>
      <PageNavbar active="Home" />
      <Divider sx={{ my: 4, borderColor: 'transparent'}} />
      {/* Main Content Section */}
        <Box sx={{
          backgroundColor: '#2c3e50', // Dark navy background
          padding: '3rem',
          borderRadius: 2,
          textAlign: 'center',
          color: 'white',
          mb: 4,
        }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            FlightBites: The Airport Cuisine Explorer
          </Typography>
          <Typography variant="h6" color="#ecf0f1" sx={{ fontWeight: 'medium' }}>
            Discover the best food destinations and plan your culinary adventures!
          </Typography>
        </Box>
      <Container>
        {/* Dashboard Section */}
        <Box sx={{ mt: 4, mb: 6 }}>
          <Dashboard />
        </Box>

        {/* Query Groups Section */}
        <Box sx={{ mb: 6 }}>
          {queryGroups.map((group, idx) => (
            // Wrapper for each section
            <Box
              key={idx}
              sx={{
                backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#ffffff', // Alternating background colors
                borderRadius: '12px', // Rounded corners
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                padding: '2rem', // Padding inside the section
                mb: 4, // Margin bottom to separate sections
              }}
            >
              {/* Section Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  letterSpacing: '0.05rem',
                  textAlign: 'center', 
                  color: '#2c3e50',
                  mb: 2,
                }}
              >
                {group.title}
              </Typography>
              {/* Section Description */}
              <Typography
                variant="subtitle1"
                gutterBottom
                color="textSecondary"
                sx={{ textAlign: 'center', mb: 4 }}
              >
                {group.description}
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  padding: '2rem',
                  borderRadius: '8px',
                  mb: 4,
                }}
              >
              {/* Cards Grid */}
              <Grid container spacing={3}>
                {group.routes.map((route, routeIdx) => (
                  <Grid item xs={12} md={6} key={routeIdx}>
                    <Card
                      sx={{
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                          border: '1px solid #3498db',
                        },
                      }}
                      onClick={() => route.implemented && history.push(route.path)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {route.name}
                          {!route.implemented && (
                            <Chip
                              label="Coming Soon"
                              size="small"
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {route.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}