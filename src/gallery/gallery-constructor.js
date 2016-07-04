'use strict';

var utilities = require('../utilities');

/**
 * @param{Array.<Object>} images
 * @param {HTMLElement} galleryBlock
 * @param {HTMLElement} photoGallery
 * @constructor
 */
function Gallery(images, galleryBlock, photoGallery) {
  /**
   * @type {HTMLElement}
   */
  this.picturesContainer = document.querySelector('.gallery-container');
  /**
   * @type {HTMLElement}
   */
  this.currentNumber = document.querySelector('.preview-number-current');
  /**
   * @type {HTMLElement}
   */
  this.totalNumber = document.querySelector('.preview-number-total');
  /**
   * @type {HTMLElement}
   */
  this.closeBtn = document.querySelector('.overlay-gallery-close');
  /**
   * @type {HTMLElement}
   */
  this.prevLinkNode = document.querySelector('.overlay-gallery-control-left');
  /**
   * @type {HTMLElement}
   */
  this.nextLinkNode = document.querySelector('.overlay-gallery-control-right');

  this.hashRegExp = /#photo\/(\S+)/;

  /**
   * @type {Array}
   */
  this.galleryPictures = [];

  this.galleryBlock = galleryBlock;
  this.images = images;
  this.photoGallery = photoGallery;

  /**
   * @constant
   * @type {number}
   */
  this.KEY_CODE_ESC = 27;

  this.currentIndex = 0;

  /**
   * @type {Image}
   */
  this.img = new Image();

  this.showNextPic = this.showNextPic.bind(this);
  this.showPrevPic = this.showPrevPic.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
  this.closeGalleryEsc = this.closeGalleryEsc.bind(this);
  this.onContainerClick = this.onContainerClick.bind(this);
  this.onHashChange = this.onHashChange.bind(this);

  this.collectPictures(images);

  this.photoGallery.addEventListener('click', this.onContainerClick);

  this.onHashChange();
  window.addEventListener('hashchange', this.onHashChange);
}

/**
 * @param  {string} imgUrl
 */
Gallery.prototype.changeUrl = function(imgUrl) {
  if (imgUrl) {
    window.location.hash = '#photo/' + imgUrl;
  } else {
    window.location.hash = '';
  }
};

/**
 * @param {Event} evt
 */
Gallery.prototype.onContainerClick = function(evt) {
  evt.preventDefault();
  if (evt.target.dataset.number !== void 0) {
    this.changeUrl(evt.target.getAttribute('src'));
  }
};

/**
 * @param {number} pictureNumber
 */
Gallery.prototype.showGallery = function(pictureNumber) {

  this.nextLinkNode.addEventListener('click', this.showNextPic);
  this.prevLinkNode.addEventListener('click', this.showPrevPic);

  this.closeBtn.addEventListener('click', this.hideGallery);
  document.addEventListener('keydown', this.closeGalleryEsc);

  utilities.setBlockHidden(this.galleryBlock);

  this.showPicture(pictureNumber);
};

Gallery.prototype.showNextPic = function() {
  var nextSrc = this.galleryPictures[this.currentIndex + 1] || this.galleryPictures[0];
  this.showGallery(this.currentIndex + 1);
  this.changeUrl(nextSrc);
};

Gallery.prototype.showPrevPic = function() {
  var nextSrc = this.galleryPictures[this.currentIndex - 1] || this.galleryPictures[this.galleryPictures.length - 1];
  this.showGallery(this.currentIndex - 1);
  this.changeUrl(nextSrc);
};

/**
 * @param {number} pictureNumber
 */
Gallery.prototype.showPicture = function(pictureNumber) {

  this.currentIndex = pictureNumber;

  if (this.currentIndex > this.galleryPictures.length - 1) {
    this.currentIndex = 0;
  }

  if (this.currentIndex < 0) {
    this.currentIndex = this.galleryPictures.length - 1;
  }

  this.img.setAttribute('src', this.galleryPictures[this.currentIndex]);
  this.picturesContainer.appendChild(this.img);
  this.currentNumber.textContent = this.currentIndex + 1;
  this.totalNumber.textContent = this.images.length;
};

/**
 * @param {Array.<Object>} nodeList
 */
Gallery.prototype.collectPictures = function(nodeList) {
  var i;
  for (i = 0; i < nodeList.length; i++) {
    this.galleryPictures.push(nodeList[i].getAttribute('src'));

    nodeList[i].dataset.number = i;
  }
};

/**
 * @param {Event} evt
 */
Gallery.prototype.closeGalleryEsc = function(evt) {
  if (evt.which === this.KEY_CODE_ESC) {
    this.hideGallery();
  }
};

Gallery.prototype.hideGallery = function() {
  this.changeUrl();

  this.nextLinkNode.removeEventListener('click', this.showNextPic);

  this.prevLinkNode.removeEventListener('click', this.showPrevPic);

  this.closeBtn.removeEventListener('click', this.hideGallery);

  document.removeEventListener('keydown', this.closeGalleryEsc);

  utilities.setBlockHidden(this.galleryBlock);
};

Gallery.prototype.onHashChange = function() {
  var hashValidate = location.hash.match(/#photo\/(\S+)/);
  if (hashValidate) {
    var pictureIndex = this.galleryPictures.indexOf(hashValidate[1]);
    this.showGallery(pictureIndex);
  }
};

module.exports = Gallery;
