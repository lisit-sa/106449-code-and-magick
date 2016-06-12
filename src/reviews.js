'use strict';

var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var allRewiews = document.querySelector('.reviews');
var templateElement = document.querySelector('template');
var elementToClone;
var IMAGE_LOAD_TIMEOUT = 10000;
var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';
var RATING_ARRAY = [
  'review-rating-one',
  'review-rating-two',
  'review-rating-three',
  'review-rating-four',
  'review-rating-five'
];
var reviews = [];
var Filter = {
  'ALL': 'all',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad',
  'RECENT': 'reviews-recent',
  'POPULAR': 'reviews-popular'
};
var DEFAULT_FILTER = Filter.ALL;

reviewsFilter.classList.toggle('invisible');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

function getReviewElement(data, container) {
  var element = elementToClone.cloneNode(true);
  element.querySelector('.review-text').textContent = data.description;
  container.appendChild(element);

  element.querySelector('.review-rating').classList.add(RATING_ARRAY[+data.rating - 1]);

  var authorImage = new Image(124, 124);
  var imageLoadTimeout;

  authorImage.onload = function() {
    clearTimeout(imageLoadTimeout);
    element.replaceChild(authorImage, element.querySelector('.review-author'));
    authorImage.classList.add('review-author');
  };

  authorImage.onerror = function() {
    element.classList.add('review-load-failure');
  };

  authorImage.src = data.author.picture;
  authorImage.alt = data.author.name;

  imageLoadTimeout = setTimeout(function() {
    authorImage.src = '';
    element.classList.add('review-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  reviewsFilter.classList.remove('invisible');
  return element;
}

var renderReviews = function() {
  reviewsContainer.innerHTML = '';

  reviews.forEach(function(review) {
    getReviewElement(review, reviewsContainer);
  });
};

var getFilteredReviews = function(filter) {
  var reviewsToFilter = reviews.slice(0);
  switch (filter) {
    case Filter.GOOD:
      reviewsToFilter.filter(function(elem) {
        return elem.rating > 2;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });
  }
  return reviewsToFilter;
};

var setFilterEnabled = function(filter) {
  var filteredReviews = getFilteredReviews(window.reviews, filter);
  renderReviews(filteredReviews);
};

var setFiltersEnabled = function(enabled) {
  var filters = reviewsFilter.querySelectorAll('.review-filter');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = enabled ? function(evt) {
      setFilterEnabled(this.id);
    } : null;
  }
};

var getReviews = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onloadstart = function() {
    allRewiews.classList.add('reviews-list-loading');
  };
  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
    allRewiews.classList.remove('reviews-list-loading');
  };
  xhr.ontimeout = function() {
    allRewiews.classList.add('reviews-load-failure');
    allRewiews.classList.remove('reviews-list-loading');
  };
  xhr.onerror = function() {
    allRewiews.classList.add('reviews-load-failure');
    allRewiews.classList.remove('reviews-list-loading');
  };

  xhr.open('GET', REVIEWS_LOAD_URL);
  xhr.send();
};

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltersEnabled(true);
  setFilterEnabled(DEFAULT_FILTER);
});
