'use strict';

var templateElement = document.querySelector('template');
var elementToClone;

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

/** @constant
 *  @type {number}
 */
var IMAGE_LOAD_TIMEOUT = 10000;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
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

}

module.exports = getReviewElement;
