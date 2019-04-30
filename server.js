'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

// constructors and var declaration
function LocationObject(search_query, formatted_query, lat, lng) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = lat.toString();
  this.longitude = lng.toString();
}

var WeatherForecast = function(forecast, timestamp) {
  this.timestamp = timestamp;
  this.forecast = forecast;
  this.time = new Date(this.timestamp * 1000).toDateString();
  weatherForecast.push(this);
};

const weatherForecast = [];

const locationData = require('./data/geo.json');


function checkLocationMatch(searchQuery, response) {
  // let locationValid = false;

  for (let i = 0 ; i < locationData.results.length; i++) {
    if (searchQuery.toLowerCase() === locationData.results[i].address_components[0].long_name.toLowerCase()) {
      // locationValid = true;
      return i;
    }
  }
  response.status(500).send(`Sorry, we could not find information about ${searchQuery}`);
}


// express middleware
app.use(cors());



app.get('/location', (request, response) => {
  let locations = locationData.results;

  // validate input
  let locationIndex = checkLocationMatch(request.query.data, response);

  let locationResponse = new LocationObject(request.query.data, locations[locationIndex].formatted_address, locations[locationIndex].geometry.location.lat, locations[locationIndex].geometry.location.lng);

  response.status(200).send(locationResponse);
});


app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

// weather endpoint
app.get('/weather', (request, response) => {

  // get lat long for matching (maybe?)
  // let location = locationData.location;

  // get weather data
  const weatherData = require('./data/darksky.json');
  weatherData.daily.data.forEach(el => {
    new WeatherForecast(el.summary, el.time);
  });

  response
    .status(200)
    .send(weatherForecast);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
