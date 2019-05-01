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

function handleError(error, response) {
  response.status(500).send(`Sorry, there was an error.`);
}

// express middleware
app.use(cors());

app.get('/location', (request, response) => {
  try {
    let locations = locationData.results;

    let locationResponse = new LocationObject(request.query.data, locations[0].formatted_address, locations[0].geometry.location.lat, locations[0].geometry.location.lng);

    response.status(200).send(locationResponse);
  } catch (error) {
    console.log('error', error);
    handleError(error, response);
  }
});

// smoke test endpoint
app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

// weather endpoint
app.get('/weather', (request, response) => {
  try {
    // get lat long for matching (maybe?)
    // let location = locationData.location;

    // get weather data
    const weatherData = require('./data/darksky.json');
    weatherData.daily.data.forEach(el => {
      new WeatherForecast(el.summary, el.time);
    });

    response.status(200).send(weatherForecast);
  } catch (error) {
    console.log('error', error);
    handleError(error, response);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
