import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const queryGroups = [
    {
      title: "Restaurant Discovery",
      description: "Find top-rated restaurants across different cities",
      routes: [
        {
          name: "Top Restaurant Cities",
          path: "/top-restaurant-cities",
          description: "Discover cities with the highest concentration of good restaurants",
          implemented: true
        },
        {
          name: "Restaurant Rankings",
          path: "/restaurant-rankings",
          description: "View rankings of individual restaurants",
          implemented: false
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
      title: "Layover Planning",
      description: "Make the most of your layovers with good food",
      routes: [
        {
          name: "Layover Restaurants",
          path: "/layover-restaurants",
          description: "Find restaurants during layovers",
          implemented: true
        },
        {
          name: "Extended Layover Planning",
          path: "/extended-layovers",
          description: "Plan longer layovers around meal times",
          implemented: false
        }
      ]
    },
    {
      title: "Destination Planning",
      description: "Find destinations based on restaurant quality",
      routes: [
        {
          name: "Good Restaurant Destinations",
          path: "/good-restaurant-destinations",
          description: "Find cities with high concentrations of good restaurants",
          implemented: true
        },
        {
          name: "Cuisine-Specific Destinations",
          path: "/cuisine-destinations",
          description: "Find destinations based on specific cuisine types",
          implemented: false
        }
      ]
    }
  ];

  return (
    <div>
        <PageNavbar active="[PageName]" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
            Food Tourism Flight Planner
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="textSecondary">
            Plan your travels around great food experiences
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
            {queryGroups.map((group) => (
            <Grid item xs={12} md={6} key={group.title}>
                <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                    {group.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                    {group.description}
                    </Typography>
                    <Grid container spacing={2}>
                    {group.routes.map((route) => (
                        <Grid item xs={12} key={route.path}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate(route.path)}
                            disabled={!route.implemented}
                            sx={{
                            backgroundColor: route.implemented ? 'primary.main' : 'grey.300',
                            '&:hover': {
                                backgroundColor: route.implemented ? 'primary.dark' : 'grey.400'
                            }
                            }}
                        >
                            {route.name}
                            {!route.implemented && " (Coming Soon)"}
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {route.description}
                        </Typography>
                        </Grid>
                    ))}
                    </Grid>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>
        </Container>
    </div>
  );
}