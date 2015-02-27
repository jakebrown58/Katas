function Box(){
}


Box.prototype.overlapping = function(b1, b2) {

  if(b1.top < b2.bottom) {
    return false;
  }
  if(b2.top < b1.bottom) {
    return false;
  }	
  if(b1.right < b2.left) {
    return false;
  }		
  if(b2.right < b1.left) {
    return false;
  }

  return true;
};

Box.prototype.findOverlappingBoxes = function(boxes) {
  var ret = [],
    i,
    j;

  for(i = 0; i < boxes.length; i++) {
    for(j = i + 1; j < boxes.length; j++) {
      if(boxes[i].id != boxes[j].id) {
        if(this.overlapping(boxes[i], boxes[j])) {
          ret.push({big: boxes[j], little: boxes[i]});
        }
      }
    }
  }

  return ret;
};

Box.prototype.boxifyPoint = function(b1) {
  var box = {top: b1.y + b1.radius / 2,
    bottom: b1.y - b1.radius / 2,
    left: b1.x - b1.radius / 2,
    right: b1.x + b1.radius / 2
  };
  return box;
}


Box.prototype.hasJustIntersected = function(b1, p1) {
  var eq = this.getEquation(p1),
    box = this.boxifyPoint(b1),
    left = box.left * eq.s + eq.y,
    right = box.right * eq.s + eq.y,
    bottom,
    top,
    ok = false;

  if(eq.x) {      // p1 is moving purely vertically.
    ok = box.left <= eq.x && eq.x <= box.right;
    if(ok) {
      var max = p1.y > p1.oldY ? p1.y : p1.oldY,
        min = p1.y > p1.oldY ? p1.oldY : p1.y,
      ok = (max >= box.top && min <= box.top) || (max >= box.bottom && min <= box.bottom);
      return ok;
    }
    return false;
  }
  if(eq.s === 0) {  // p1 is moving purely horizontally.
    return false;
  }

  top = (box.top - eq.y) / eq.s;
  bottom = (box.bottom - eq.y) / eq.s;

  if(left <= box.top && left >= box.bottom) {
    ok = true;
  }
  if(right <= box.top && right >= box.bottom) {
    ok = true;
  }
  if(top <= box.right && top >= box.left) {
    ok = true;
  }
  if(bottom <= box.right && bottom >= box.left) {
    ok = true;
  }  

  return ok;
};

Box.prototype.getSlope = function(p) {
  var dx = p.oldX - p.x;

  if(dx === 0) {
    return 'infinity';
  }
  return (p.oldY - p.y) / (p.oldX - p.x);
};

Box.prototype.getYIntercept = function(slope, point) {
  if(slope === 'infinity') {
    return {x: point.x};
  }
  return point.y - slope * point.x;
};

Box.prototype.getEquation = function(p) {
  var slope = this.getSlope(p);
  var yIntercept = this.getYIntercept(slope, p);


  if(slope !== 'infinity') {
    return {s: slope, y: yIntercept};
  } else {
    return {x: yIntercept.x};
  }
};


if (typeof exports !== 'undefined') {
  exports.Box = Box;
}