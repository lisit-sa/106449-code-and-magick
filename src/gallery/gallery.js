'use strict';

(function() {
  var Gallery = require('./gallery-constructor');

  var galleryBlock = document.querySelector('.overlay-gallery');
  var images = document.querySelectorAll('.photogallery-image > img');
  var photoGallery = document.querySelector('.photogallery');

  Gallery = new Gallery(images, galleryBlock, photoGallery);
})();
