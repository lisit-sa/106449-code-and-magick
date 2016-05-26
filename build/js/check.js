'use strict';

var getMessage = function(a, b) {

	

	if (typeof a === 'boolean') {
	    if (a === true) {
	      	return 'Я попал в ' + b;
	    } else {
	      	return 'Я никуда не попал';
	    };
	}

    if (typeof a === 'number') {
    	return 'Я прыгнул на ' + a * 100 + ' сантиметров';
  	}

  	if (Array.isArray(a) && !Array.isArray(b)) {
  		
    	var sum = a.reduce(function(start, current) {
      	return start + current;
    	});

    return 'Я прошёл ' + sum + ' шагов';

 	}

 	if (Array.isArray(a) && Array.isArray(b)) {

		var lengthA = a.reduce(function(start, current) {
      return start + current;
    });

    var lengthB = b.reduce(function(start, current) {
      return start + current;
    });

    var length = lengthA + lengthB;

    return 'Я прошёл ' + length + ' метров';
  }
};