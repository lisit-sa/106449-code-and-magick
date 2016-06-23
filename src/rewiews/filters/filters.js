'use strict';

var filterList = require('./filterlist');

/** @constant {number} */
var MILLISECONDS = 4 * 24 * 60 * 60 * 1000;

/**
 * @param {Filter} filter
 * @return {Array.<Object>} reviewsToFilter
 */
function getFilteredReviews(reviews, filter) {
  var reviewsToFilter = reviews.slice(0);
  switch (filter) {
    case filterList.RECENT:
      reviewsToFilter = reviewsToFilter.filter(function(data) {
        return Date.parse(data.date) > (Date.now() - MILLISECONDS);
      }).sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
      break;
    case filterList.GOOD:
      reviewsToFilter = reviewsToFilter.filter(function(data) {
        return data.rating > 2;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case filterList.BAD:
      reviewsToFilter = reviewsToFilter.filter(function(data) {
        return data.rating < 3;
      }).sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;
    case filterList.POPULAR:
      reviewsToFilter = reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }

  return reviewsToFilter;
}

module.exports = getFilteredReviews;
