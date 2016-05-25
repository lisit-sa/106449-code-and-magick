'use strict';

var getMessage = function(a, b) {

	var i;

	if (typeof a === 'boolean') {
	    if (a === true) {
	      	return 'Я попал в ' + b;
	    } else {
	      	return 'Я никуда не попал';
	    };
	}

    else if (typeof a === 'number') {
    	return 'Я прыгнул на ' + a * 100 + ' сантиметров';
  	}

  	else if (Array.isArray(a) && !Array.isArray(b)) {
    	var sum = 0;

    	for (i = 0; i < a.length; i++) {
      		sum += a[i];
    	};

		return 'Я прошёл ' + sum + ' шагов';

 	}

 	else if (Array.isArray(a) && Array.isArray(b)) {
		var length = 0;

		for (i = 0; i < a.length; i++) {
			length += a[i] * b[i];
		};

		return 'Я прошёл ' + length + ' метров';
 	}
};