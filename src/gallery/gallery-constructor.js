'use strict';

var utilities = require('../utilities');

/**
 * @param{Array.<Object>} images
 * @param {HTMLElement} galleryBlock
 * @param {HTMLElement} photoGallery
 * @constructor
 */
function Gallery(images, galleryBlock, photoGallery) {
  var self = this;
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

  /**
   * @constant
   * @type {number}
   */
  this.KEY_CODE_ESC = 27;

  var currentIndex;

  /**
  * @type {Image}
  */
  this.img = new Image();

  /**
  * @type {HTMLElement}
  */
  this.photoGallery = photoGallery;
  /**
  * @param  {string} imgUrl
  */
  this.changeUrl = function(imgUrl) {
    if (imgUrl) {
      window.location.hash = '#photo/' + imgUrl;
    } else {
      window.location.hash = '';
    }
  };
  /**
   * @param {Event} evt
   */
  this.onContainerClick = function(evt) {
    evt.preventDefault();
    if (evt.target.dataset.number !== void 0) {
      self.changeUrl(evt.target.getAttribute('src'));
    }
  };

  this.photoGallery.addEventListener('click', this.onContainerClick);

  /**
   * @param {number} pictureNumber
   */
  this.showGallery = function(pictureNumber) {

    self.nextLinkNode.addEventListener('click', this.showNextPic);
    self.prevLinkNode.addEventListener('click', this.showPrevPic);

    self.closeBtn.addEventListener('click', this.hideGallery);
    document.addEventListener('keydown', this.closeGalleryEsc);

    utilities.setBlockHidden(galleryBlock);

    self.showPicture(pictureNumber);
  };

  this.showNextPic = function() {
    var nextSrc = self.galleryPictures[++currentIndex] || self.galleryPictures[0];
    self.showGallery(++currentIndex);
    self.changeUrl(nextSrc);
  };

  this.showPrevPic = function() {
    var nextSrc = self.galleryPictures[--currentIndex] || self.galleryPictures[self.galleryPictures.length - 1];
    self.showGallery(--currentIndex);
    self.changeUrl(nextSrc);
  };

  /**
   * @param {number} pictureNumber
   */
  this.showPicture = function(pictureNumber) {

    currentIndex = pictureNumber;

    if (currentIndex > this.galleryPictures.length - 1) {
      currentIndex = 0;
    }

    if (currentIndex < 0) {
      currentIndex = this.galleryPictures.length - 1;
    }

    this.img.setAttribute('src', this.galleryPictures[currentIndex]);
    this.picturesContainer.appendChild(this.img);
    this.currentNumber.textContent = currentIndex + 1;
    this.totalNumber.textContent = images.length;
  };

  /**
   * @param {Array.<Object>} nodeList
   */
  this.collectPictures = function(nodeList) {
    var i;
    for (i = 0; i < nodeList.length; i++) {
      this.galleryPictures.push(nodeList[i].getAttribute('src'));

      nodeList[i].dataset.number = i;
    }
  };
  /**
   * @param {Event} evt
   */
  this.closeGalleryEsc = function(evt) {
    if (evt.which === self.KEY_CODE_ESC) {
      self.hideGallery();
    }
  };

  this.hideGallery = function() {
    self.changeUrl();

    self.nextLinkNode.removeEventListener('click', this.showNextPic);

    self.prevLinkNode.removeEventListener('click', this.showPrevPic);

    self.closeBtn.removeEventListener('click', this.hideGallery);

    document.removeEventListener('keydown', this.closeGalleryEsc);

    utilities.setBlockHidden(galleryBlock);
  };

  self.collectPictures(images);

  this.onHashChange = function() {
    var hashValidate = location.hash.match(/#photo\/(\S+)/);
    if (hashValidate) {
      var pictureIndex = self.galleryPictures.indexOf(hashValidate[1]);
      self.showGallery(pictureIndex);
    }
  };
  this.onHashChange();

  window.addEventListener('hashchange', this.onHashChange);

}

module.exports = Gallery;
