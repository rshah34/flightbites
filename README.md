# FlightBites
One of the biggest reasons people travel to different cities is to try the various cuisines available away from home. Another common situation is when travelers are in other cities for work or layovers and need a place to eat. In both cases, a website that combines flight information with restaurants would be useful for making plans and decisions easier. The project aims to allow people to search for their favorite cuisines or the highest-rated restaurants open between their domestic flights.

Files:
- `cleanAirlines.py`: Python script for cleaning the IBM Reporting Carrier On-Time Performance Dataset for relevant information on common flights. 
- `cleanedRestaurant.ipynb`: script for cleaning the Yelp Open Dataset for relevant restaurant data

## To run web app:

Run `npm install` in the client and server files.

To start the frontend, cd into the client folder and run `npm start`

To start the backend, cd into the server folder and run `node index.js`

Then, navigate to localhost, and the web app should be running with the backend connected.

## List of dependencies:

These can also be found in the package.json files.



For frontend:

@emotion/react@11.4.1
@emotion/styled@11.3.0
@mui/material@5.0.0
@testing-library/jest-dom@4.2.4
@testing-library/react@9.3.2
@testing-library/user-event@7.1.2
bootstrap@4.4.1
react-bootstrap@1.0.0-beta.16
react-dom@17.0.2
react-router-dom@5.3.0
react-scripts@5.0.1
react@17.0.2



For backend:

body-parser@1.19.0
cors@2.8.5
express@4.17.1
mysql@2.17.1
nodemon@2.0.20
pg@8.13.1
