'use strict';

(function() {
  var filtersReviews = require('./filters/filters');
  var filterList = require('./filters/filterlist');
  var utilities = require('../utilities');
  var load = require('./load');
  var Review = require('./review');

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsMore = document.querySelector('.reviews-controls-more');

  /** @constant {string} */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /** @constant {number} */
  var PAGE_SIZE = 3;

  /** @type {number} */
  var pageNumber = 0;

  /** @constant
   *  @type {Filter}
   */
  var DEFAULT_FILTER = filterList.ALL;

  /** @type {Array.<Object>} */
  var reviews = [];

  /** @type {Array.<Object>} */
  var filteredReviews = [];

  /** @type {Array.<Object>} */
  var savedReviews = [];

  reviewsFilter.classList.toggle('invisible');

  /**
   * @param {Array.<Object>} reviewsToRender
   * @param {number} page
   * @param {boolean} replace
  */
  function renderReviews(reviewsToRender, page, replace) {
    if (replace) {
      savedReviews.forEach(function(review) {
        review.remove();
      });

      savedReviews = [];
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    if (reviewsToRender.length) {
      reviewsToRender.slice(from, to).forEach(function(review) {
        savedReviews.push(new Review(review, reviewsContainer));
      });
    } else{
      var newDiv = document.createElement('div');
      newDiv.innerHTML = 'Нет подходящих отзывов';
      reviewsContainer.appendChild(newDiv);
    }
    reviewsMore.classList.toggle('invisible', to >= reviewsToRender.length);
  }

  function makeSupElement() {
    var filters = reviewsFilter.querySelectorAll('label');

    Array.prototype.forEach.call(filters, function(filterInArray) {
      var filtersName = filterInArray.getAttribute('for');
      var filterReviews = filtersReviews(reviews, filtersName);
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
    filteredReviews = filtersReviews(reviews, filter);
    pageNumber = 0;
    renderReviews(filteredReviews, pageNumber, true);
    var currentFilter = document.getElementById(filter);
    currentFilter.setAttribute('checked', true);
  }

  function setFiltersEnabled() {
    reviewsFilter.addEventListener('change', function(evt) {
      if (evt.target.hasAttribute('name')) {
        var thisFilter = evt.target.id;
        setFilterEnabled(thisFilter);
        localStorage.setItem('savedFilter', thisFilter);
      }
    });
  }

  function showMoreReviews() {
    reviewsMore.addEventListener('click', function() {
      if (utilities.isNextPageAvailable(filteredReviews, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderReviews(filteredReviews, pageNumber);
      }
    });
  }

  load(REVIEWS_LOAD_URL, function(loadedReviews) {
    reviews = loadedReviews;
    setFiltersEnabled();
    if (localStorage.getItem('savedFilter') === null) {
      setFilterEnabled(DEFAULT_FILTER);
    } else {
      setFilterEnabled(localStorage.getItem('savedFilter'));
    }
    makeSupElement();
    showMoreReviews();
    reviewsFilter.classList.remove('invisible');
  });
})();
