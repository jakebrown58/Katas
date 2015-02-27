function longSqrt() {
}
   
longSqrt.prototype.run = function(pivot, array) {    
    var conts = 10000,
        masses = [],
        x = [],
        y = [],
        accX = [],
        accY = [];
    
    var i = 0;

    for(; i < conts; i++) {
        masses.push(1);
        x.push(i * 2);
        y.push(i * 2);

        accX.push(0);
        accY.push(0);
    }

    var outer = 0;
    var inner = 1;

    var tmp = 0;
    var dx = 0;
    var dy = 0;
    var grav = 0;

    for(outer = 0; outer < conts; outer++) {
        for(inner = 1; inner < conts; inner++) {
            if(outer === inner) {
                continue;
            }

            dx = x[inner] - x[outer];
            dy = y[inner] - y[outer];

            tmp = Math.sqrt(dx * dx + dy * dy);
            grav = masses[inner] / tmp;
            accX[outer] += grav * dx;
            accY[outer] += grav * dy;
        }
        
    }
    
}

if (typeof exports !== 'undefined') {
   exports.longSqrt = longSqrt
}