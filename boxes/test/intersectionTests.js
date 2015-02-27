var assert = require("should");

var app = require("../boxes.js");

describe('Boxes - getSlope', function() {
  it('should find slope correctly', function() {
    var p2 = { x: 1, y: 1, oldX: -1, oldY: -1};
    var actual = new app.Box().getSlope(p2);
    assert.equal(1, actual);

    actual = new app.Box().getSlope({x: 1, y: 2, oldX: 0, oldY: 0});
    assert.equal(2, actual);
  });
});

describe('Boxes - getYIntercept', function() {
  it('should find yIntercept correctly', function() {
    var p2 = { x: 1, y: 1, oldX: -1, oldY: -1};
    var actual = new app.Box().getYIntercept(1, {x: 2, y: 2});
    assert.equal(0, actual);
  });
});

describe('Boxes - Boxify', function() {
  it('should make boxes correctly.', function() {
    var x = new app.Box();
    var p1 = { id: 0, x: 0, y: 0, radius: 1, oldX: 0, oldY: 0};

    var actual = x.boxifyPoint(p1);
    assert.equal(.5, actual.top);
    assert.equal(-.5, actual.bottom);
    assert.equal(-.5, actual.left);
    assert.equal(.5, actual.right);
  });
});

describe('Boxes - HasJustIntersected', function() {
  it('should find pairs correctly when there is a left / right intersection ', function() {
    var x = new app.Box();
    var p1 = { id: 0, x: 0, y: 0, radius: 1, oldX: 0, oldY: 0};
    var p2 = { id: 0, x: 1, y: 1, radius: .001, oldX: -1, oldY: -1};

    var actual = x.hasJustIntersected(p1, p2);
    assert.equal(true, actual);
  });
});

describe('Boxes - HasJustIntersected', function() {
  it('should find pairs correctly when there is pure-vertical moving point in box', function() {
    var x = new app.Box();
    var p1 = { id: 0, x: 0, y: 0, radius: 2, oldX: 0, oldY: 0};
    var p2 = { id: 0, x: 1, y: 2, radius: .001, oldX: 1, oldY: -2};

    var actual = x.hasJustIntersected(p1, p2);
    assert.equal(true, actual);
  });
});

describe('Boxes - HasJustIntersected', function() {
  it('should find pairs correctly when there is pure-vertical moving point not in box', function() {
    var x = new app.Box();
    var p1 = { id: 0, x: 0, y: 0, radius: 1, oldX: 0, oldY: 0};
    var p2 = { id: 0, x: 100, y: 100, radius: .001, oldX: 100, oldY: 99};

    var actual = x.hasJustIntersected(p1, p2);
    assert.equal(false, actual);

    p2 = { id: 0, x: 5, y: 1, radius: .001, oldX: 5, oldY: -1};
    actual = x.hasJustIntersected(p1, p2);
    assert.equal(false, actual);
  });
});

describe('Boxes - HasJustIntersected', function() {
  it('should find pairs correctly when there is a top-bottom intersection', function() {
    var x = new app.Box();
    var p1 = { id: 0, x: 0, y: 0, radius: 1, oldX: 0, oldY: 0};
    var p2 = { id: 0, x: 0, y: 5, radius: .001, oldX: .1, oldY: -10};

    var actual = x.hasJustIntersected(p1, p2);
    assert.equal(true, actual);
  });
});