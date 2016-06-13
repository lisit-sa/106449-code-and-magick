'use strict';

var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var allRewiews = document.querySelector('.reviews');
var templateElement = document.querySelector('template');
var NO_REVIEWS = document.querySelector('#no-reviews');
//var oneRewiewFilter = document.querySelectorAll('.reviews-filter-item');
//var NEW_SUP = document.createElement('sup');
var elementToClone;
var IMAGE_LOAD_TIMEOUT = 10000;
var MILLISECONDS = 4 * 24 * 60 * 60 * 1000;
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
  'ALL': 'reviews-all',
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

function renderReviews(reviewsToRender) {
  reviewsContainer.innerHTML = '';
  reviewsToRender.forEach(function(review) {
    getReviewElement(review, reviewsContainer);
  });
}

function getFilteredReviews(filter) {
  var reviewsToFilter = reviews.slice(0);
  switch (filter) {
    case Filter.RECENT:
      reviewsToFilter = reviewsToFilter.filter(function(data) {
        return Date.parse(data.date) > (Date.now() - MILLISECONDS);
      }).sort(function(a, b) {
        return Date.parse(b.date) - Date.parse(a.date);
      });
      break;
    case Filter.GOOD:
      reviewsToFilter = reviewsToFilter.filter(function(data) {
        return data.rating > 2;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case Filter.BAD:
      reviewsToFilter = reviewsToFilter.filter(function(data) {
        return data.rating < 3;
      }).sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;
    case Filter.POPULAR:
      reviewsToFilter = reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }
  //попытка сделать доп. задание
  // for (var i = 0; i < oneRewiewFilter.length; i++) {
  //   oneRewiewFilter[i].onclick = function() {
  //     NEW_SUP.innerHTML = reviewsToFilter.length;
  //     this.appendChild(NEW_SUP);
  //   };
  // }

  if (reviewsToFilter.length === 0) {
    NO_REVIEWS.css({
      display: 'block'
    });
  }
  return reviewsToFilter;
}

function setFilterEnabled(filter) {
  var filteredReviews = getFilteredReviews(filter);
  renderReviews(filteredReviews);
}

function setFiltersEnabled() {
  var filters = reviewsFilter.querySelectorAll('input[type="radio"]');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.id);
    };
  }
}

function getReviews(callback) {
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
}

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltersEnabled();
  setFilterEnabled(DEFAULT_FILTER);
});
