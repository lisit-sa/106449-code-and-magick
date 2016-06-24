'use strict';

(function() {
  // var utilities = require('../utilities');

  var galleryBlock = document.querySelector('.overlay-gallery');
  var closeBtn = document.querySelector('.overlay-gallery-close');
  var picturesContainer = document.querySelector('.gallery-container');
  var images = document.querySelectorAll('.photogallery-image > img');
  var currentNumber = document.querySelector('.preview-number-current');
  var allNumbers = document.querySelector('.preview-number-total');

  /** @param {Array.<Object>} */
  // var galleryPictures = [];
  // var currentImage = 0;

  var KEY_CODE_ESC = 27;

  function showGallery() {
    Array.prototype.forEach.call(images, function(imageInArray) {
      imageInArray.addEventListener('click', function(evt) {
        evt.preventDefault();
        galleryBlock.classList.remove('invisible');
        picturesContainer.innerHTML = '';
        var picture = new Image();
        picturesContainer.appendChild(picture);
        picture.src = evt.target.src;
        currentNumber.innerHTML = imageInArray;
        allNumbers.innerHTML = images.length;
      });
    });
  }

  function hideGallery() {
    galleryBlock.classList.add('invisible');
  }

  function closeGallery() {
    closeBtn.addEventListener('click', function() {
      hideGallery();
      closeBtn.removeEventListener('click');
    });
    document.addEventListener('keydown', function(evt) {
      if (evt.which === KEY_CODE_ESC) {
        hideGallery();
        document.removeEventListener('keydown');
      }
    });
  }

  closeGallery();
  showGallery();

})();
