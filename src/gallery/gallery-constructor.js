'use strict';

var utilities = require('../utilities');

/**
 * @constructor
 */
function Gallery(images, galleryBlock, photoGallery) {
  var self = this;
  var closeBtn = document.querySelector('.overlay-gallery-close');
  var picturesContainer = document.querySelector('.gallery-container');
  var currentNumber = document.querySelector('.preview-number-current');
  var totalNumber = document.querySelector('.preview-number-total');
  var prevLinkNode = document.querySelector('.overlay-gallery-control-left');
  var nextLinkNode = document.querySelector('.overlay-gallery-control-right');

  //* @param {Array.<Object>}
  var galleryPictures = [];

  /** @constant {number} */
  var KEY_CODE_ESC = 27;

  var currentIndex;

  var img = new Image();

  this.photoGallery = photoGallery;
  photoGallery.addEventListener('click', this.onContainerClick);

  /**
   * @param {Array.<Object>} evt
   */
  this.onContainerClick = function(evt) {
    if (evt.target.dataset.number !== void 0) {
      self.showGallery(Number(evt.target.dataset.number));
    }
  };

  /**
   * @param {number} pictureNumber
   */
  this.showGallery = function(pictureNumber) {

    nextLinkNode.addEventListener('click', self.showNextPic);
    prevLinkNode.addEventListener('click', self.showPrevPic);

    closeBtn.addEventListener('click', self.hideGallery);
    document.addEventListener('keydown', self.closeGalleryEsc);

    utilities.setBlockHidden(galleryBlock);

    self.showPicture(pictureNumber);
  };

  this.showNextPic = function() {
    self.showPicture(++currentIndex);
  };

  this.showPrevPic = function() {
    self.showPicture(--currentIndex);
  };

  /**
   * @param {number} pictureNumber
   */
  this.showPicture = function(pictureNumber) {
    currentIndex = pictureNumber;

    if (currentIndex > galleryPictures.length - 1) {
      currentIndex = 0;
    }

    if (currentIndex < 0) {
      currentIndex = galleryPictures.length - 1;
    }

    img.setAttribute('src', galleryPictures[currentIndex]);
    picturesContainer.appendChild(img);
    currentNumber.textContent = currentIndex + 1;
    totalNumber.textContent = images.length;
  };

  /**
   * @param {Array.<number>} nodeList
   */
  this.collectPictures = function(nodeList) {
    var i;
    for (i = 0; i < nodeList.length; i++) {
      galleryPictures.push(nodeList[i].getAttribute('src'));

      nodeList[i].dataset.number = i;
    }
  };

  this.closeGalleryEsc = function(evt) {
    if (evt.which === KEY_CODE_ESC) {
      self.hideGallery();
    }
  };

  this.hideGallery = function() {
    nextLinkNode.removeEventListener('click', self.showNextPic);

    prevLinkNode.removeEventListener('click', self.showPrevPic);

    closeBtn.removeEventListener('click', self.hideGallery);

    document.removeEventListener('keydown', self.closeGalleryEsc);

    utilities.setBlockHidden(galleryBlock);
  };

  self.collectPictures(images);

}

module.exports = Gallery;
