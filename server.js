'use strict';

require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('./'));

app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

// hold weather forecast
const weatherForecast = [];

// constructor for weather object
var WeatherForecast = function(forecast, time) {
  this.forecast = forecast;
  this.time = time;
  weatherForecast.push(this);
};

// weather endpoint
app.get('/weather', (request, response) => {

  // get lat long
  const locationData = require('./data/geo.json');
  let location = locationData.location;

  // get weather data
  const weatherData = require('./data/darksky.json');
  weatherData.daily.data.forEach(el => {
    new WeatherForecast(el.summary, el.time);
  });

  response
    .status(200)
    .send(weatherForecast);

});

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
