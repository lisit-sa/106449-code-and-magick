'use strict';

module.exports = {

  isNextPageAvailable: function(reviews, page, pageSize) {
    return page < Math.ceil(reviews.length / pageSize);
  },

  setBlockHidden: function(block, setter) {
    block.classList.toggle('invisible', setter);
  },

  expireCookie: function() {
    var MILLISECOND = 24 * 60 * 60 * 1000;
    var thisDate = new Date();
    var thisYear = thisDate.getFullYear();
    var birthday = new Date(thisYear, 1, 15);

    if (thisDate < birthday) {
      birthday.setFullYear(thisYear - 1);
    }
    return Math.round((thisDate - birthday) / MILLISECOND);
  }
};
