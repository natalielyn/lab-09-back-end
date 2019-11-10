'use strict';

require('dotenv').config();

//Dependencies and setup
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//Configure Database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.error(err));

//Errors
function notFoundHandler(request,response) {
  response.status(404).send('huh?');
}
function errorHandler(error,request,response) {
  response.status(500).send(error);
}

// API ROUTES --------------------------------------

app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/movies', getMovies);



app.use('*', notFoundHandler);
app.use(errorHandler);

// HELPER FUNCTIONS


// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`) );