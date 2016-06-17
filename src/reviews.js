'use strict';

var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var allRewiews = document.querySelector('.reviews');
var templateElement = document.querySelector('template');
var reviewsMore = document.querySelector('.reviews-controls-more');
var elementToClone;

/** @constant
 *  @type {number}
 */
var IMAGE_LOAD_TIMEOUT = 10000;

/** @constant {number} */
var MILLISECONDS = 4 * 24 * 60 * 60 * 1000;

/** @constant {string} */
var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

/** @constant {number} */
var PAGE_SIZE = 3;

/** @type {number} */
var pageNumber = 0;

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

/** @type {Array.<Object>} */
var filteredReviews = [];

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

/**
 * @param {Array.<Object>} reviewsToRender
 * @param {number} page
 * @param {boolean} replace
*/
function renderReviews(reviewsToRender, page, replace) {
  if (replace) {
    reviewsContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  if (reviewsToRender.length) {
    reviewsToRender.slice(from, to).forEach(function(review) {
      getReviewElement(review, reviewsContainer);
    });
  } else{
    var newDiv = document.createElement('div');
    newDiv.innerHTML = 'Нет подходящих отзывов';
    reviewsContainer.appendChild(newDiv);
  }
  reviewsMore.classList.toggle('invisible', to >= reviewsToRender.length);
}

/**
 * @param {Array.<Object>} reviews
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

  Array.prototype.forEach.call(filters, function(filterInArray) {
    var filtersName = filterInArray.getAttribute('for');
    var filterReviews = getFilteredReviews(filtersName);
    setSupText(filterInArray, filterReviews.length);
    if(filterReviews.length) {
      filterInArray.classList.remove('disabled');
    } else{
      filterInArray.classList.add('disabled');
      filterInArray.previousSibling.disabled = true;
    }
  });
}

/**
 * @param {HTMLElement} label
 * @param {number} filterReviewsLength
 */
function setSupText(label, filterReviewsLength) {
  var newSup = document.createElement('sup');
  newSup.innerHTML = filterReviewsLength;
  label.appendChild(newSup);
}

/** @param {Filter} filter */
function setFilterEnabled(filter) {
  filteredReviews = getFilteredReviews(filter);
  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber, true);
}

function setFiltersEnabled() {
  reviewsFilter.addEventListener('change', function(evt) {
    if (evt.target.hasAttribute('name')) {
      setFilterEnabled(evt.target.id);
    }
  });
}

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
/**
 * @param {number} page
 * @param {number} pageSize
 * @return {boolean}
 */
function isNextPageAvailable(page, pageSize) {
  return page < Math.ceil(reviews.length / pageSize);
}

function showMoreReviews() {
  reviewsMore.addEventListener('click', function() {
    if (isNextPageAvailable(pageNumber, PAGE_SIZE)) {
      pageNumber++;
      renderReviews(filteredReviews, pageNumber);
    }
  });
}

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  getClone();
  setFiltersEnabled();
  makeSupElement();
  setFilterEnabled(DEFAULT_FILTER);
  showMoreReviews();
});
