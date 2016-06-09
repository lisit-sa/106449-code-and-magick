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
// var IMAGE_LOAD_TIMEOUT = 10000;

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getReviewElement = function(data, container) {

  var element = elementToClone.cloneNode(true);
  element.querySelector('.review-rating').textContent = data.rating;
  element.querySelector('.review-text').textContent = data.description;
  element.querySelector('.review-rating').textContent = data.rating;
  container.appendChild(element);

  // var backgroundImage = new Image();
  // var backgroundLoadTimeout;

  //   backgroundImage.onload = function(evt) {
  //       clearTimeout(backgroundLoadTimeout);
  //       element.style.backgroundImage = 'url(\'' + evt.target.src + '\')';
  //   };

  //   backgroundImage.onerror = function() {
  //       element.classList.add('hotel-nophoto');
  //   };

  //   backgroundImage.src = data.preview;

  //   backgroundLoadTimeout = setTimeout(function() {
  //       backgroundImage.src = '';
  //       element.classList.add('hotel-nophoto');
  //   }, IMAGE_LOAD_TIMEOUT);

  reviewsFilter.removeClass('invisible');
  return element;
};
console.log(rewiews)

window.rewiews.forEach(function(rewiew) {
  getReviewElement(rewiew, reviewsContainer);
});
