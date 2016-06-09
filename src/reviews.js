'use strict';
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsFilter = document.querySelector('.reviews-filter');
var templateElement = document.querySelector('template');
var elementToClone;
reviewsFilter.classList.toggle('invisible');
if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getReviewElement = function(data, container) {

  var element = elementToClone.cloneNode(true);

  element.querySelector('.review-text').textContent = data.description;

  container.appendChild(element);

  var reviewRating = element.querySelector('.review-rating');
  switch (data.rating) {
    case 1:
      reviewRating.classList.add('review-rating-one');
      break;
    case 2:
      reviewRating.classList.add('review-rating-two');
      break;
    case 3:
      reviewRating.classList.add('review-rating-three');
      break;
    case 4:
      reviewRating.classList.add('review-rating-four');
      break;
    case 5:
      reviewRating.classList.add('review-rating-five');
      break;
  }

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

  imageLoadTimeout = setTimeout(function() {
    authorImage.src = '';
    element.classList.add('review-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  reviewsFilter.classList.remove('invisible');
  return element;
};

window.reviews.forEach(function(review) {
  getReviewElement(review, reviewsContainer);
});
