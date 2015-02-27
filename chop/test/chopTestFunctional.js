var assert = require("should");

var demoCode = require("../chopFunctional.js");

describe('Chop - Functional - API Exists', function() {
	it('should exist as a method', function() {
		var x = new demoCode.Chopper();
		assert.exist(x.chop);
		assert.equal(-1, x.chop(1, []));
	});
});

describe('Chop - Functional - Item in only position', function() {
	it('should return 0 when passed an 1 to an array [1]', function() {
		var x = new demoCode.Chopper();
		assert.equal(0, x.chop(1, [1]));
	});
});

describe('Chop - Functional - Item not in only position', function() {
	it('should return -1 when passed an 1 to an array [2]', function() {
		var x = new demoCode.Chopper();
		assert.equal(-1, x.chop(1, [2]));
	});
});

describe('Chop - Functional - Item in first position', function() {
	it('should return 0 when passed an 5 to an array [5,10]', function() {
		var x = new demoCode.Chopper();
		assert.equal(0, x.chop(5, [5,10]));
	});
});


describe('Chop - Functional - Item in last position', function() {
	it('should return 1 when passed an 5 to an array [1,5]', function() {
		var x = new demoCode.Chopper();
		assert.equal(1, x.chop(5, [1,5]));
	});
});

describe('Chop - Functional - Item not in set', function() {
	it('should return -1 when passed a value not in the set', function() {
		var x = new demoCode.Chopper();
		assert.equal(-1, x.chop(5, [1,10]));
	});
});

describe('Chop - Functional - Public tests', function() {
	it('should pass all the public tests', function() {
		var x = new demoCode.Chopper();

		assert.equal(-1, x.chop(3, []));
		assert.equal(-1, x.chop(3, [1]));
		assert.equal(0,  x.chop(1, [1]));

		assert.equal(0,  x.chop(1, [1, 3, 5]));
		assert.equal(1,  x.chop(3, [1, 3, 5]));
		assert.equal(2,  x.chop(5, [1, 3, 5]));
		assert.equal(-1, x.chop(0, [1, 3, 5]));
		assert.equal(-1, x.chop(2, [1, 3, 5]));
		assert.equal(-1, x.chop(4, [1, 3, 5]));
		assert.equal(-1, x.chop(6, [1, 3, 5]));

		assert.equal(0,  x.chop(1, [1, 3, 5, 7]));
		assert.equal(1,  x.chop(3, [1, 3, 5, 7]));
		assert.equal(2,  x.chop(5, [1, 3, 5, 7]));
		assert.equal(3,  x.chop(7, [1, 3, 5, 7]));
		assert.equal(-1, x.chop(0, [1, 3, 5, 7]));
		assert.equal(-1, x.chop(2, [1, 3, 5, 7]));
		assert.equal(-1, x.chop(4, [1, 3, 5, 7]));
		assert.equal(-1, x.chop(6, [1, 3, 5, 7]));
		assert.equal(-1, x.chop(8, [1, 3, 5, 7]));
	});
});