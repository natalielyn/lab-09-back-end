'use strict';
//Todo Yelp functions
//Todo Movie data to datbase;
//Todo Deploy to Heroku

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

//Constructor Functions -------------------------------

function Location(query, data){
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

//Define a prototype function to save data to DB
Location.prototype.save = function(handler){
  const SQL = `INSERT INTO locations
  (search_query, formatted_query, latitude, longitude)
  VALUES ($1, $2, $3, $4)
  RETURNING *`;

  let values = Object.values(this);
  console.log(values);
  return client.query(SQL, values);
};

//Define a prototype functionto save weather data to DB.
Weather.prototype.save = function(handler){
  const SQLweather = `INSERT INTO weather
  (forcast, time)'
  VALUES ($1, $2)
  RETURNING *`;
  let values = Object.values(this);
  return client.query(SQLweather, values);
};

//My Static Constructor Functions

Location.fetchLocation = function (query){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then( result=> {
      if(!result.body.results.length) {throw 'No data';}
      let location = new Location(query, result.body.results[0]);
      return location.save()
        .then( result => {
          location.id = result.rows[0].id; 
          console.log(location);
          console.log(location.latitude);
          return location;
        });
    });
};

Location.lookup = (handler) => {
  const SQL = `SELECT * FROM locations WHERE search_query=$1`;
  const values = [handler.query];

  return client.query(SQL, values)
    .then( results => {
      if (results.rowCount > 0){
        handler.cacheHit(results);
      }else {
        handler.cacheMiss();
      }
    })
    .catch(console.error);
};

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
}

//MOVIE CONSTRUCTOR FUNCTION
function Movie(data) {
  this.title = data.title;
  this.overview = data.overview
  this.released_on = data.release_date;
  this.total_votes = data.vote_count;
  this.average_votes = data.vote_average;
  this.popularity = data.popularity;
  this.image_url = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
};

//Route Handlers

function getLocation(request,response) {

  const locationHandler = {
    query: request.query.data,

    cacheHit: (results) => {
      console.log('Got data from DB');
      console.log(request.query.data);
      response.send(results.rows[0]);
    },

    cacheMiss: () => {
      console.log('No data in DB, fetching...');
      Location.fetchLocation(request.query.data)
        .then( data => response.send(data));
    }
  };
  Location.lookup(locationHandler);
}

function getWeather(request, response) {

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  superagent.get(url)
    .then( data => {
      const weatherSummaries = data.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch( ()=> {
      errorHandler('So sorry, something went really wrong', request, response);
    });

}

function getMovies(request, response) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${request.query.data.search_query}`;

  superagent.get(url)
  .then(data => {
    const movies = data.body.results.map(movie => {
      const newMovie = new Movie(movie);
      console.log('movies');
      return newMovie;
    });
    response.status(200).json(movies);
  })
  .catch( () =>{ 
    error.handler('Whoops, the movie request went South', request, response)
  });
}



app.use('*', notFoundHandler);
app.use(errorHandler);

// HELPER FUNCTIONS


// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`) );