'use strict';

// DEPENDENCIES ------------------------------------
const superagent = require('superagent');

//YELP CONSTRUCTOR FUNCTION ------------------------
function YelpReviews(data) {
  this.name = data.name;
  this.rating = data.rating;
  this.price = data.price;
  this.url = data.url;
  this.image_url = data.image_url;
  this.created_at = Date.now();
};

//GET YELP API -------------------------------------
function getYelpReviews(request, response) {
  const url = `https://api.yelp.com/v3/businesses/search?location=${request.formatted_query}`;
  return superagent
  .get(url)
  .then(result => {
    const yelpData = result.body.businesses.map(data => {
      return new YelpReviews(data);
    })
    response.status(200).json(yelpData);
  })
  .catch(() => response.status(500).send('So sorry, something went really wrong', request, response));
};


// Export API fetch
module.exports = getYelp;