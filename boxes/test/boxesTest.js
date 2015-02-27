var assert = require("should");

var app = require("../boxes.js");

describe('Boxes - API Exists', function() {
  it('should exist as a method', function() {
    var x = new app.Box();
    assert.exist(x);
    assert.exist(x.overlapping);
  });
});


describe('Boxes - Overlapping - Same Box', function() {
  it('should overlap when it is the same box', function() {
    var x = new app.Box();
    var b1 = {
      bottom: 0,
      top: 1,
      left: 3,
      right: 4
    };

    b2 = {
      bottom: 0,
      top: 1,
      left: 3,
      right: 4            
    }

    assert.equal(true, x.overlapping(b1, b2));
  });
});

describe('Boxes - Overlapping - One In The Other', function() {
  it('should should overlap when one is inside the other', function() {
    var x = new app.Box();
    var b1 = { top: 3, bottom: 0, left: 2, right: 5};
    var b2 = { top: 2, bottom: 1, left: 3, right: 4};
    assert.equal(true, x.overlapping(b1, b2));
  });
});

describe('Boxes - Overlapping - Only Corners Match', function() {
  it('should overlap when only the corners touch', function() {
    var x = new app.Box();
    var b1 = { top: 10, bottom: 0, left: 0, right: 10};
    var b2 = { top: 0, bottom: -10, left: -10, right: 0};   // top right touch
    assert.equal(true, x.overlapping(b1, b2));

    b2 = { top: 0, bottom: -10, left: 10, right: 20};   // top left touch
    assert.equal(true, x.overlapping(b1, b2));

    b2 = { top: 20, bottom: 10, left: 10, right: 20}; // bottom right touch
    assert.equal(true, x.overlapping(b1, b2));

    b2 = { top: 20, bottom: 10, left: -10, right: 0}; // bottom left touch
    assert.equal(true, x.overlapping(b1, b2));
  });
});

describe('Boxes - Overlapping - Not Intersecting', function() {
  it('should not intersect when they are far away', function() {
    var x = new app.Box();
    var b1 = { top: -3, bottom: -1, left: -2, right: -5};
    var b2 = { top: 2, bottom: 1, left: 3, right: 4};
    assert.equal(false, x.overlapping(b1, b2));
  });
});

describe('Boxes - FindOverlappingBoxes - API Exists', function() {
  it('should exist', function() {
    assert.exists(new app.Box().findOverlappingBoxes);
  });
});

describe('Boxes - FindOverlappingBoxes - Less than two boxes', function() {
  it('should not find any intersections with less than 2 boxes', function() {
    var x = new app.Box();
    assert.equal(0, x.findOverlappingBoxes([]).length);
    assert.equal(0, x.findOverlappingBoxes([{}]).length);
  });
});

describe('Boxes - FindOverlappingBoxes - Two identical boxes', function() {
  it('should find 1 pair when there are 2 identical boxes', function() {
    var x = new app.Box();
    var b1 = { id: 0, bottom: 0, top: 1, left: 0, right: 1};
    var b2 = { id: 1, bottom: 0, top: 1, left: 0, right: 1};

    var actual = x.findOverlappingBoxes([b1, b2]);
    assert.equal(1, actual.length);
    assert.equal(1, actual[0].big.id);
    assert.equal(0, actual[0].little.id);
  });
});

describe('Boxes - FindOverlappingBoxes - Two different boxes', function() {
  it('should not find any pairs when there are only two different boxes', function() {
    var x = new app.Box();
    var b1 = { id: 0, bottom: 0, top: 1, left: 0, right: 1};
    var b2 = { id: 1, bottom: 10, top: 11, left: 10, right: 11};

    var actual = x.findOverlappingBoxes([b1, b2]);
    assert.equal(0, actual.length);
  });
});

describe('Boxes - FindOverlappingBoxes - Various box combinations', function() {
  it('should find pairs correctly when there are mixed matches', function() {
    var x = new app.Box();
    var boxes = [];
    boxes.push({ id: 0, bottom: 0, top: 1, left: 0, right: 1});
    boxes.push({ id: 1, bottom: 10, top: 11, left: 10, right: 11});
    boxes.push({ id: 2, bottom: 0, top: 1, left: 0, right: 1});

    var actual = x.findOverlappingBoxes(boxes);
    assert.equal(1, actual.length);
    assert.equal(2, actual[0].big.id);
    assert.equal(0, actual[0].little.id);
  });
});