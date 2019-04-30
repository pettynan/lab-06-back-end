'use strict';



require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function LocationObject(search_query, formatted_query, lat, lng) {
  this.search_query = search_query,
  this.formatted_query = formatted_query;
  this.latitude = lat.toString();
  this.longitude = lng.toString();
}



app.get('/location', (request, response) => {

  const locationData = require('./data/geo.json');

  let locationResponse = new LocationObject(request.query.data, locationData.results[0].formatted_address, locationData.results[0].geometry.location.lat, locationData.results[0].geometry.location.lng);

  console.log(locationResponse);

  response.status(200).send(locationResponse);
});


app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});


app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
