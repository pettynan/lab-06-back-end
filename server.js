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
  let searchQuery = request.query.data;
  let locationIndex;

  for (let i = 0 ; i < locationData ; i++) {
    if (searchQuery.toLowerCase() === locationData.results[i].address_components[0].long_name.toLowerCase()) {
      locationIndex = i;
      console.log(locationIndex);
      break;
    }
    if (i === locationData.results.length - 1) {
      response.status(500).send(`Sorry, we could not find information about ${searchQuery}`);
    }
  }



  let locationResponse = new LocationObject(searchQuery, locationData.results[locationIndex].formatted_address, locationData.results[locationIndex].geometry.location.lat, locationData.results[locationIndex].geometry.location.lng);

  console.log(locationResponse);

  response.status(200).send(locationResponse);
});


app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});


app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
