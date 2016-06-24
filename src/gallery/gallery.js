'use strict';

(function() {
  // var utilities = require('../utilities');

  var galleryBlock = document.querySelector('.overlay-gallery');
  var closeBtn = document.querySelector('.overlay-gallery-close');
  var picturesContainer = document.querySelector('.gallery-container');
  var images = document.querySelectorAll('.photogallery-image > img');
  var currentNumber = document.querySelector('.preview-number-current');
  var allNumbers = document.querySelector('.preview-number-total');
  //var prevLinkNode = document.querySelector('.overlay-gallery-control-left');
  var nextLinkNode = document.querySelector('.overlay-gallery-control-right');

  //* @param {Array.<Object>}
  var galleryPictures = [];
  var currentImgIndex = 0;

  var KEY_CODE_ESC = 27;

  // функция сохранения массива из фотографий
  function saveImages() {
    galleryPictures = Array.prototype.map.call(images, function(imageInArray) {
      return imageInArray.getAttribute('src');
    });
    return galleryPictures;
  }
  //Показ следующей картинки
  function nextImage() {
    nextLinkNode.addEventListener('click', function(number) {
      number = currentImgIndex + 1;
      showGallery(number);
      showPicture(number.src);
    });
  }
  //скрываем галерею
  function hideGallery() {
    galleryBlock.classList.add('invisible');
    document.removeEventListener('keydown', closeGallery());
    closeBtn.removeEventListener('click', closeGallery());
  }
  //скрываем галерею
  function closeGallery() {
    closeBtn.addEventListener('click', function() {
      hideGallery();
    });
    document.addEventListener('keydown', function(evt) {
      if (evt.which === KEY_CODE_ESC) {
        hideGallery();
      }
    });
  }
  //функция показа галереи
  function showGallery(index) {
    Array.prototype.forEach.call(images, function(image) {
      image.addEventListener('click', function(evt) {
        var imgIndex = galleryPictures.indexOf(index);
        galleryBlock.classList.remove('invisible');
        saveImages(galleryPictures[imgIndex]);
        showPicture(evt.target.src);
      });
    });
    nextImage();
    closeGallery();
  }
  //функция показа фотографии
  function showPicture(pic) {
    picturesContainer.innerHTML = '';
    var picture = new Image();
    picturesContainer.appendChild(picture);
    picture.src = pic;
    currentNumber.innerHTML = currentImgIndex + 1;
    allNumbers.innerHTML = images.length;
  }

  showGallery(currentImgIndex);

})();
