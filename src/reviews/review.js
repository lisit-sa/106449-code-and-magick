'use strict';

var getReviewElement = require('./getReviewElement');

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */
function Review(data, container) {
  this.data = data;
  this.element = getReviewElement(this.data, container);

  this.clickOnQuiz = function(evt) {
    var activeQuiz = container.querySelector('.review-quiz-answer-active');
    if (evt.target.classList.contains('review-quiz-answer')) {
      if (activeQuiz) {
        activeQuiz.classList.remove('review-quiz-answer-active');
      }
      evt.target.classList.add('review-quiz-answer-active');
    }
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.clickOnQuiz);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.clickOnQuiz);
  this.element.parentNode.appendChild(this.element);
}

module.exports = Review;
