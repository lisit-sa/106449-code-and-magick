'use strict';

var allRewiews = document.querySelector('.reviews');

function load(url, callback) {

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
  xhr.open('GET', url);
  xhr.send();
}

module.exports = load;
