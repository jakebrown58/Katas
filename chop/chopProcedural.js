function Chopper(){
}

Chopper.prototype.chop = function(pivot, array) {
	var top,
		bottom,
		check,
		val;

	if(array.length === 0 ){
		return -1;
	}

	top = array.length - 1;
	bottom = 0;
	check = Math.floor(top / 2);

	do {
		val = array[check];
		if(val === pivot) {
			return check;
		}

		if(val < pivot) {
			bottom = check + 1;

		}
		if(val > pivot) {
			top = check - 1;
		}
		check = Math.floor((top + bottom)/2);
	} while(bottom < top) 

	if(array[check] === pivot) {
		return check;
	}

	return -1;
}


if (typeof exports !== 'undefined') {
   exports.Chopper = Chopper
}