function Chopper(){
}

// Chopper.prototype.chop = function(pivot, array, top, bottom, check) {
// 	if(array.length === 0 ){
// 		return -1;
// 	}

// 	top = top ? top : array.length - 1;
// 	bottom = bottom ? bottom : 0;
// 	check = check ? check : Math.floor(top / 2);

// 	if(array[check] === pivot) {
// 		return check;
// 	}
// 	if(array[check] < pivot) {
// 		bottom = check + 1;
// 	}
// 	if(array[check] > pivot) {
// 		top = check - 1;
// 	}
	
// 	if(bottom > top) {
// 		if(array[bottom] === pivot) {
// 			return bottom;
// 		}
// 		if(array[top] === pivot) {
// 			return top;
// 		}
// 		return -1;
// 	}

// 	return this.chop(pivot, array, top, check + 1, Math.floor((top + bottom)/2));
// }


Chopper.prototype.chop = function(pivot, array) {
	if(array.length === 0 ){
		return -1;
	} 
	if(array.length === 1 ) {
		return array[0] === pivot ? 0 : -1;
	}

	var	top = array.length;
	var check = Math.floor(top / 2);
	var passThrough = 0;
	var subArray = array;

	if(subArray[check] > pivot) {
		subArray = array.slice(0, check);
	}
	if(subArray[check] < pivot) {
		passThrough = check;
		subArray = array.slice(check, top);
	}

	if(array[check] === pivot) {
		return check;
	}

	var next = this.chop(pivot, subArray);

	return next === -1 ? -1 : next + passThrough;
}



if (typeof exports !== 'undefined') {
   exports.Chopper = Chopper
}