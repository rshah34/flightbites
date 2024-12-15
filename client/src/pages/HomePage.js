import { useHistory } from 'react-router-dom'; 
import { Container, Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
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
        }
      ]
    },
    {
      title: "Multi-City Food Tours",
      description: "Plan multi-city trips based on restaurant quality",
      routes: [
        {
          name: "Three-City Food Tours",
          path: "/three-city-routes",
          description: "Find optimal three-city routes with great restaurants",
          implemented: true
        },
        {
          name: "Food Tour Flights",
          path: "/food-tour-flights",
          description: "Find flights connecting cities with good restaurants",
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
        }
      ]
    }
  ];

  return (
    <>
      <PageNavbar active="Home" />
      <Container>
        {/* Dashboard Section */}
        <Box sx={{ mt: 4, mb: 6 }}>
          <Dashboard />
        </Box>

        {/* Main Content Section */}
        <Box sx={{ backgroundColor: '#f5f5f5', padding: 3, borderRadius: 2, mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Airport Cuisine Explorer
          </Typography>
          <Typography variant="h6" gutterBottom color="textSecondary">
            Discover the best food destinations and plan your culinary adventures
          </Typography>
        </Box>

        {/* Query Groups Section */}
        <Box sx={{ mb: 6 }}>
          {queryGroups.map((group, idx) => (
            <Box key={idx} sx={{ mb: 6 }}>
              <Typography variant="h4" gutterBottom>
                {group.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom color="textSecondary">
                {group.description}
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {group.routes.map((route, routeIdx) => (
                  <Grid item xs={12} md={6} key={routeIdx}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: route.implemented ? 'pointer' : 'default',
                        opacity: route.implemented ? 1 : 0.7,
                        '&:hover': {
                          boxShadow: route.implemented ? 6 : 1
                        }
                      }}
                      onClick={() => route.implemented && history.push(route.path)}  // Change this line
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
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
          ))}
        </Box>
      </Container>
    </>
  );
}