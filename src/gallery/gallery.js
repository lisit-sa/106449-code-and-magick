'use strict';

(function() {
  var gallery = require('./gallery_utility');
  var photoContainer = document.querySelector('.photogallery');
  var allNumbers = document.querySelector('.preview-number-total');
  var images = document.querySelectorAll('.photogallery-image > img');
  var currentNumber = document.querySelector('.preview-number-current');

  //* @param {Array.<Object>}
  var galleryPictures = [];

  // функция сохранения массива из фотографий
  function saveImages() {
    for(var i = 0; i < images.length; i++) {
      galleryPictures.push(images[i].getAttribute('src'));
      images[i].dataset.number = i;
    }
    setGallery();
  }

  //Вызываем галерею
  function setGallery() {
    photoContainer.addEventListener('click', function(evt) {
      evt.preventDefault();
      var number = evt.target.getAttribute('data-number');
      gallery.showGallery(number, galleryPictures);
      gallery.showPicture(galleryPictures[number]);
      currentNumber.textContent = +number + 1;
      allNumbers.textContent = images.length;
    });
  }

  saveImages();
  gallery.hideGallery();

})();
