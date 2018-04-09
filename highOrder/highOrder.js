var _ = require('lodash');

function FunctionalExtensions(){
	this.deferMap = this.mapWith();

}

if (typeof exports !== 'undefined') {
   exports.FunctionalExtensions = FunctionalExtensions;
}

FunctionalExtensions.prototype.doubler = function (list) {
	var newList = [],
		i;
	for(i = 0; i < list.length; i++) {
		newList.push(list[i] * 2);
	}
	return newList;
}


/* changing the loop to a function */
FunctionalExtensions.prototype.doublerWithEach = function(list) {
	var newList = [];
	_.each(list, function(itm) {
		newList.push(itm * 2);
	});
	return newList;
}

/* cool, but this newList and pushing stuff is irritating.  it seem redundant.
   what can be do about that? 
	.... map
*/

FunctionalExtensions.prototype.doublerWithMap = function(list) {
	return _.map(list, function(n) {
		return n * 2;
	});
}


/* and of course, if we already defined the inner function, we can simplify again */ 
FunctionalExtensions.prototype.doubleValue = function (n) {
	return n * 2;
}

///   doublerWithMapAgain([1,2,3]) ==>   [2,4,6]
FunctionalExtensions.prototype.doublerWithMapWithNamedFunction = function(list) {
	return _.map(list, this.doubleValue);
}

/* this's fine.... but I still have 2 parameters to multiply things. */
FunctionalExtensions.prototype.Multiplier = function() {
	this.multiplier = {};

	this.multiplyByX = function multiplyBy(x) {
	    return function(n) {
	        return x * n;
	    };
	};
};

FunctionalExtensions.prototype.Multiplier.prototype.makeMultiplier = function(x) {
	this.multiplier = this.multiplyByX(x);
};

FunctionalExtensions.prototype.Multiplier.prototype.multiplySomeData = function(list) {
	return _.map(list, this.multiplier);
};

FunctionalExtensions.prototype.DeferredTransform = function(transformFn) {
	this.partiallyAppliedFn = {};
	this.logicFn = transformFn;
};

FunctionalExtensions.prototype.DeferredTransform.prototype.setTransform = function(transformFn) {
	this.logicFn = transformFn;
	return this;
};

FunctionalExtensions.prototype.DeferredTransform.prototype.partiallyApply = function(args) {
	this.partiallyAppliedFn = this.logicFn(args);
	return this;
};

FunctionalExtensions.prototype.DeferredTransform.prototype.fullyApply = function(list) {
	return _.map(list, this.partiallyAppliedFn);
};


// now we have a couple of interesting advantages.
// 1) you only have to set the multiplier once.
// 2) we've decoupled the data and the logic
/// you can execute the logic again and again and only have to pass along the data.
/// you can also execute the logic against other types of transforms more easily.
// if you think about that a second.... this is letting us set repeatable business logic once, 
//   and then pass along data to that logic again and again.

// but this example just shows how to convert 2 argument functions into deferred 1 argument functions.
// what happens when we want to chain a x argument functions into (x-1) argument functions?
// .... curry (around since at least the 1960's but not well known outside of functional areas.)


/* here's what curry looks like for reference */
FunctionalExtensions.prototype.curry = function (fn) {
	return function curried (a, optionalB) {
		if(arguments.length > 1) {
			return fn.call(this, a, optionalB);
		} else return function partiallyApplied(b) {
			return fn.call(this, a, b);
		}
	}
};


/* here's what flip looks like */
FunctionalExtensions.prototype.flip = function (fn) {
	return function flipped (a, b) {
		return fn.call(this, b, a);
	}
}

/* here's a simple get function */
FunctionalExtensions.prototype.get = function (object, property) {
	return object[property];
}


/// the problem with curry is that it reduces arguments from the beginning to the end.
/// and map's arguments are essentially ({data}, {logic})
/// and we get our value out of currying by storing {logic} ahead of time, 
//		and giving us a function that's just ({data})
//  so we "flip" the parameters of map to get "mapWith: ({logic}, {data})"
FunctionalExtensions.prototype.mapWith = function() {
	return this.curry(this.flip(_.map));
}

/// var getFooFn = getWith('foo');
// 	getFooFn({foo: 1}) ==> 1
//  getFooFn({bar: 1}) ==> null
//var getWith = curry(flip(get));

/// findAllValuesByKey({foo: 1, bar: 'blah'}, 'bar') ==> 'blah'
function findValueByKey(obj, key) {
	var getWith = curry(flip(get));
	return getWith(key)(obj);	// extract values of the key from object.
}

/// mapValuesByKey([{bar: 'a'}, {bar: 'b'}], 'bar') ==> ['a','b']
function mapValuesByKey(list, key) {
	var getWith = curry(flip(get));
    return _.map(list, function(itm) {
    	return findValueByKey(itm, key);
	});
}

/* cool, but that's clunky, and I could write that just as easily without the curry.... 
	.... good point, let's introduce a couple helper functions instead.
*/
/// mapWith(findFn('foo'), [{foo: 'a'}, {foo: 'b'}])	==> ['a','b']
function findFn(key) {
	return getWith(key);
}


/* that's kind of neat.  findFn looks usable, but the usage via mapWith is still confusing and ugly.
	....good point, let's move the mapWith inside of the findFn.
		introducing 'pluckWith'.
*/
///	var pluckFooFn = pluckWith('foo');
//  pluckFooFn([{foo: 'a'}, {foo: 'b'}]))	==> ['a','b']
function pluckWith (attr) {
	return mapWith(getWith(attr));
}

/* ok... but isn't that basically the same as mapValuesByKey from above, just with the parameters reversed?
	...not exactly.  because we can evaluate the find once, and pass it around, and execute
		it many times on lots of objects.
*/


/// now let's examine something we do here a lot.....
/// imagine a form where the user can enter the name of a field and hit search 
/// and it'll return all of the values of that field.
/// we'll take a look at the controller and some events this might handle.

/// here's the stub of our controller that we'll use throuout the exmples.
function SomeFrontEndController() {
	this.fieldName = null;
	this.searchHits = [];

	function onUserEntersFindText(e) {};
	function onUserSearch(e) {};
	function onUserDoingSomeOtherThing(e) {};
}


/// here's what that implementation might look like using loops.
function SomeFrontEndController() {
	this.fieldName = null;
	this.searchHits = [];

	function onUserEntersFindText(e) {
		this.fieldName = getSomeTextBoxValue();
	}

	function onUserSearch(e) {
		var data = getSomeRawData(),
			i;
		// maybe does a bunch of other stuff.
		for(i = 0; i < data.length; i++){
			this.searchHits.push(data[i][this.fieldName]);
		}
	}

	function onUserDoingSomeOtherThing(e) {
		var data = getSomeRawData(),
			i;
		// maybe does a bunch of other stuff.
		for(i = 0; i < data.length; i++){
			this.searchHits.push(data[i][this.fieldName]);
		}
	}
	/// the loops are kind of heavyweight.  and visually, the code doesn't read well, as the 'this.fieldName' is buried in the body of a double [][].
	/// it's 3 lines of code each time we want to reset the searchHits from the ajax data.
}

/// our first step might be to refactor the loop and put it in a new function.
function SomeFrontEndController() {
	this.fieldName = null;
	this.searchHits = [];

	function onUserEntersFindText(e) {
		this.fieldName = getSomeTextBoxValue();
	}

	function onUserSearch(e) {
		var data = getSomeRawData(),
			i;
		// maybe does a bunch of other stuff.
		this.searchHits = this.populateHitsFromData(data);
	}

	function onUserDoingSomeOtherThing(e) {
		var data = getSomeRawData(),
			i;
		// maybe does a bunch of other stuff.
		this.searchHits = this.populateHitsFromData(data);
	}

	function populateHitsFromData(data) {
		var hits = [];
		for(i = 0; i < data.length; i++){
			hits.push(data[i][this.fieldName]);
		}
		return hits;
	}
	/// well, this certainly makes the event handlers read cleaner,
	/// 	but if you're tracing the code you have to bounce to another function to follow along with the program.
	/// plus, if this is a big controller, 
	///		chances are somebody is going to write that loop in line somewhere else because they won't realize a helper exists.
}

/// our next step might be to get rid of the loops and replace them with 'map'.
function SomeFrontEndController() {
	this.fieldName = null;
	this.searchHits = [];

	function onUserEntersFindText(e) {
		this.fieldName = getSomeTextBoxValue();
	}

	function onUserSearch(e) {
		var data = getSomeRawData();
		// maybe does a bunch of other stuff.
		this.searchHits = this.populateHitsFromData(data);
	}

	function onUserDoingSomeOtherThing(e) {
		var data = getSomeRawData();
		// maybe does a bunch of other stuff.
		this.searchHits = this.populateHitsFromData(data);
	}

	function populateHitsFromData(data) {
		var hits = [];
		return _.map(data, function(itm) { this.searchHits.push(itm[this.fieldName])});
	}

	/// this map function is not really all that much better than the loop.
	/// plus we still have a one-off  of the drawbacks of the extra function.
}


/// here's what that might look like using pluck.
function SomeFrontEndController() {
	this.fieldName = null;
	this.searchHits = [];

	function onUserEntersFindText(e) {
		var txt = getSomeTextBoxValue();
		this.fieldName = txt;
	}

	function onUserSearch(e) {
		var data = getSomeRawData();
		// maybe does a bunch of other stuff.
		this.searchHits = _.pluck(data, this.fieldName);
	}

	function onUserDoingSomeOtherThing(e) {
		var data = getSomeRawData();
		// maybe does a bunch of other stuff.
		this.searchHits = _.pluck(data, this.fieldName);
	}

	// since pluck reads so clean and simple, I just put it back in-line, and did away with the helper function.
	// but now I have 3 deferences to this.fieldName again, which makes a rename or other side effects a higher risk.
}

/// let's use a curried version of pluck instead.
function SomeFrontEndController() {
	this.searchHits = [];
	this.pluckFieldName = pluckWith('');  // this is a curried function

	function onUserEntersFindText(e) {
		var fieldName = getSomeTextBoxValue();
		this.pluckFieldName = pluckWith(fieldName);
	}

	function onUserSearch(e) {
		var data = getSomeRawData();
		// maybe does a bunch of other stuff.
		this.searchHits = this.pluckFieldName(data);
	}

	function onUserDoingSomeOtherThing(e) {
		var data = getSomeRawData();
		// maybe does a bunch of other stuff.
		this.searchHits = this.pluckFieldName(data);
	}

	/// here I removed 'this.fieldName', and replaced it with 'this.pluckFieldName' which holds a function. 
	/// the upside is that the experience for the callers is the simplest of all.	
	/// the downside is that when we go to debug, it's harder to know what the value of fieldName is when we go to set the searchHits.
	///		if you want, you can keep this.fieldName as a field; 
	///		at the expense of having an extra field and inviting later developers to use it directly instead of using the finder function.
	///		which would duplicate logic and increase maintenance costs.
	/// plus its easier to reconfigure specific parts of the business logic at runtime this way than it would be with a static function.
	
	/// the mechanics of dealing with the fieldName now lives in only one place
	/// and now we can now reuse finder as many place and times as we want very easily.
	/// notice the actual text of the search only needs to appear once in the code.
	/// there's only one spot where we care about what the 'key' is, and one dependency on the UI.

	/// of course, there's still the risk of someone writing a for loop in the code later on to do exactly the same thing.
	///  ...but that's why I did this lunch and learn.
}


// digging a little bit deeper.....
// ...'pluck' uses map and get.   It's just really a special case of MAP that is hard coded to use GET.
// ....in other words composing map with get.  
function compose (a, b) {
	return function composed (c) {
		return a(b(c));
	}
}

var pluck = compose(_.map, _.get);

//var pluckWith2 = compose(mapWith, getWith);		/// equivelent to:   "mapWith(getWith(attr))";  .... except now it's implicit that we're 
// versus
function pluck(mappable, key) {
	return mappable.map(function(obj) {
		return obj[key];
	});
}
function pluckWith(key, mappable) {
	return pluck(mappable, key);
}


/*
var Jimp = require('Jimp');

var input = Jimp.read("./in2.jpg", function (err, image) {
	boxate(image);
});

var boxate = function(image) {
	let boxSize = 4;
	let boxSize2 = boxSize * boxSize;
	let xBoxes = image.bitmap.width / boxSize;
	let yBoxes = image.bitmap.height / boxSize;
	
	var img2 = new Jimp(Math.ceil(xBoxes), Math.ceil(yBoxes), function(err, image) {});

	for(let xx = 0; xx < xBoxes; xx++) {
		for(let yy = 0; yy < yBoxes; yy++) {
			let colorR = 0;
			let colorG = 0;
			let colorB = 0;
			for(let x = 0; x < boxSize; x++) {
				for(let y = 0; y < boxSize; y++) {
					let localX = xx * boxSize + x;
					let localY = yy * boxSize + y;
					let color = Jimp.intToRGBA(image.getPixelColor(localX,localY));
					colorR += color.r;
					colorG += color.g;
					colorB += color.b;
				}
			}
			colorR = colorR / boxSize2;
			colorG = colorG / boxSize2;
			colorB = colorB / boxSize2;

			if(colorG > 125 && colorB > 125 && colorR > 125) {
				colorR = 205;
				colorG = 205;
				colorB = 205;
			}
			else if(colorG > colorB) {
				if(colorR > 70) {
					colorG = 180;
				 	colorB = 0;
			 		colorR = 130;					
				}
				else if(colorG > colorR * 1.5) {
					colorG = 170;
				 	colorB = 30;
			 		colorR = 40;		
			 	} 
			 	else {
					colorG = 90;
				 	colorB = 70;
			 		colorR = 70;		
			 	}
			}
			else if(colorB > colorG && colorB > colorR) {
				colorB = 250;
				colorG = 10;
				colorR = 0;
			}

			img2.setPixelColor(Jimp.rgbaToInt(colorR, colorG, colorB, 255), xx, yy);
		}
	}
	img2.write('./test3.png');
};
*/
