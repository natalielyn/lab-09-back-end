'use strict';

// DEPENDENCIES ------------------------------------
require('dotenv').config();
const superagent = require('superagent');

//YELP CONSTRUCTOR FUNCTION ------------------------
function Yelp(review) {
  this.name = review.name;
  this.rating = review.rating;
  this.price = review.price;
  this.url = review.url;
  this.image_url = review.image_url;
  this.created_at = Date.now();
};

//GET YELP API -------------------------------------
function getYelp(request,response) {
  const url = `https://api.yelp.com/v3/businesses/search?latitude=${request.query.data.latitude}&longitude=${request.query.data.longitude}`;
  return superagent
    .get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(result => {
      const yelpData = result.body.businesses.map(data => {
        return new Yelp(data);
      })
      response.status(200).json(yelpData);
    })
    .catch(() => response.status(500).send('So sorry, something went really wrong', request, response));
};




// Export API fetch
module.exports = getYelp;