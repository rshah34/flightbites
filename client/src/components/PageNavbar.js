import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PageNavbar({ active }) {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Layover Restaurants', path: '/layover-restaurants' },
    { name: 'Food Tours', path: '/food-tour-flights' },
    { name: 'Three-City Routes', path: '/three-city-routes' },
    { name: 'Top Cities', path: '/top-restaurant-cities' },
    { name: 'Restaurant Destinations', path: '/good-restaurant-destinations' }
  ];

	return (
		<div className="PageNavbar">
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<span className="navbar-brand center">CIS550 Exercise 3</span>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<div className="navbar-nav">
						{navDivs}
					</div>
				</div>
			</nav>
		</div>
	);

}