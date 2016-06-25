'use strict';

var galleryBlock = document.querySelector('.overlay-gallery');
var closeBtn = document.querySelector('.overlay-gallery-close');
var picturesContainer = document.querySelector('.gallery-container');
var currentNumber = document.querySelector('.preview-number-current');
var prevLinkNode = document.querySelector('.overlay-gallery-control-left');
var nextLinkNode = document.querySelector('.overlay-gallery-control-right');

var KEY_CODE_ESC = 27;

//Показ галереи по индексу, переключение картинок
function showGallery(index, imgArray) {
  nextLinkNode.addEventListener('click', function(evt) {
    evt.preventDefault();
    showPicture(imgArray[++index]);
    currentNumber.textContent = index + 1;
    if(index < (imgArray.length - 1)) {
      nextLinkNode.classList.remove('invisible');
      prevLinkNode.classList.remove('invisible');
    } else {
      nextLinkNode.classList.add('invisible');
    }
  });
  prevLinkNode.addEventListener('click', function(evt) {
    evt.preventDefault();
    showPicture(imgArray[--index]);
    currentNumber.textContent = index + 1;
    if(index !== 0) {
      prevLinkNode.classList.remove('invisible');
      nextLinkNode.classList.remove('invisible');
    } else {
      prevLinkNode.classList.add('invisible');
    }
  });
  closeBtn.addEventListener('click', function closeGallery() {
    galleryBlock.classList.add('invisible');
  });
  document.addEventListener('keydown', function closeGallery(evt) {
    if (evt.which === KEY_CODE_ESC) {
      galleryBlock.classList.add('invisible');
    }
  });
}

//показ картинок
function showPicture(pic) {
  var picture = new Image();
  galleryBlock.classList.remove('invisible');
  picturesContainer.innerHTML = '';
  picturesContainer.appendChild(picture);
  picture.src = pic;
}

//снимаем обработчики
function hideGallery() {
  document.removeEventListener('keydown', showGallery());
  closeBtn.removeEventListener('click', showGallery());
  prevLinkNode.removeEventListener('click', showGallery());
  nextLinkNode.removeEventListener('click', showGallery());
}

module.exports = {
  showGallery: showGallery,
  hideGallery: hideGallery,
  showPicture: showPicture
};
