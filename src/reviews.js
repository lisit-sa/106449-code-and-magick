'use strict';

var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var allRewiews = document.querySelector('.reviews');
var templateElement = document.querySelector('template');
var elementToClone;

/** @constant
 *  @type {number}
 */
var IMAGE_LOAD_TIMEOUT = 10000;

/** @constant {number} */
var MILLISECONDS = 4 * 24 * 60 * 60 * 1000;

/** @constant {string} */
var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

/**
 * @constant
 * @type {Array.<string>}
 */
var RATING_ARRAY = [
  'review-rating-one',
  'review-rating-two',
  'review-rating-three',
  'review-rating-four',
  'review-rating-five'
];

/** @type {Array.<Object>} */
var reviews = [];

/** @enum {string} */
var Filter = {
  ALL: 'reviews-all',
  BAD: 'reviews-bad',
  GOOD: 'reviews-good',
  POPULAR: 'reviews-popular',
  RECENT: 'reviews-recent'
};

/** @constant
 *  @type {Filter}
 */
var DEFAULT_FILTER = Filter.ALL;

reviewsFilter.classList.toggle('invisible');

function getClone() {
  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.review');
  } else {
    elementToClone = templateElement.querySelector('.review');
  }
}

/**
 * @param {Object} data
 * @param {HTMLElement} container
 */
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
}

/** @param {Array.<Object>} reviewsToRender */
function renderReviews(reviewsToRender) {
  reviewsContainer.innerHTML = '';
  if (reviewsToRender.length) {
    reviewsToRender.forEach(function(review) {
      getReviewElement(review, reviewsContainer);
    });
  } else{
    var newDiv = document.createElement('div');
    newDiv.innerHTML = 'Нет подходящих отзывов';
    reviewsContainer.appendChild(newDiv);
  }
}

/**
 * @param {Filter} filter
 */
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

  return reviewsToFilter;
}

function makeSupElement() {
  var filters = reviewsFilter.querySelectorAll('label');
  for (var i = 0; i < filters.length; i++) {
    var filtersName = filters[i].getAttribute('for');
    var filterRewiews = getFilteredReviews(filtersName);
    setSupText(filters[i], filterRewiews.length);
    if(filterRewiews.length) {
      filters[i].classList.remove('disabled');
    } else{
      filters[i].classList.add('disabled');
      filters[i].previousSibling.disabled = true;
    }
  }
}

/**
 * @param {HTMLElement} label
 * @param {number} filterRewiewsLength
 */
function setSupText(label, filterRewiewsLength) {
  var newSup = document.createElement('sup');
  newSup.innerHTML = filterRewiewsLength;
  label.appendChild(newSup);
}

/** @param {Filter} filter */
function setFilterEnabled(filter) {
  var filteredReviews = getFilteredReviews(filter);
  renderReviews(filteredReviews);
}

reviewsFilter.addEventListener('change', function setFiltersEnabled(event) {
  setFilterEnabled(event.target.id);
});

/** @param {function(Array.<Object>)} callback */
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
  getClone();
  makeSupElement();
  setFilterEnabled(DEFAULT_FILTER);
});
