function Chopper(){
}


Chopper.prototype.chop = function(key, array) {
	var obj = this.initializeSplitIndexes(array);

	var isKeyAtMidpoint = curry(this.isFound)(key);

	do {
		if(isKeyAtMidpoint(array[obj.check])) { 
			return obj.check;
		}
		
		obj = this.buildSplitIndexes(key, array[obj.check], obj.top, obj.bottom, obj.check);
	} while(obj.bottom < obj.top) 

	return isKeyAtMidpoint(array[obj.check]) ? obj.check : -1;
}

Chopper.prototype.initializeSplitIndexes = function(array) {
	return obj = {
		top: array.length -1,
		bottom: 0,
		check: this.getNewMid(0, array.length -1)
	};
}

Chopper.prototype.getNewBottom = function(pivot, value, check, bottom) {
	return value < pivot ? check + 1 : bottom;
}

Chopper.prototype.getNewTop = function(pivot, value, check, top) {
	return value > pivot ? check - 1 : top;
}

Chopper.prototype.getNewMid = function(bottom, top) {
	return Math.floor((top + bottom)/2);
}

Chopper.prototype.isFound = function(val, pivot) {
	return val === pivot;
}

Chopper.prototype.buildSplitIndexes = function(pivot, val, top, bottom, check) {
	var ret = {};
	ret.found = false;
	ret.bottom = this.getNewBottom(pivot, val, check, bottom);
	ret.top = this.getNewTop(pivot, val, check, top);
	ret.check = this.getNewMid(ret.bottom, ret.top);
	return ret;
}

function curry (fn) {
	return function curried (a, optionalB) {
		if(arguments.length > 1) {
			return fn.call(this, a, optionalB);
		} else return function partiallyApplied(b) {
			return fn.call(this, a, b);
		}
	}
}

if (typeof exports !== 'undefined') {
   exports.Chopper = Chopper;
}