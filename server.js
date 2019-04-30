'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3000;

// constructors and var declaration
function LocationObject(search_query, formatted_query, lat, lng) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = lat.toString();
  this.longitude = lng.toString();
}

var WeatherForecast = function(forecast, time) {
  this.forecast = forecast;
  this.time = time;
  weatherForecast.push(this);
};

const weatherForecast = [];

const locationData = require('./data/geo.json');

// express middleware
app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/location', (request, response) => {

  let locationResponse = new LocationObject(request.query.data, locationData.results[0].formatted_address, locationData.results[0].geometry.location.lat, locationData.results[0].geometry.location.lng);

  console.log(locationResponse);

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
