var assert = require("should");
var _ = require('lodash');
var graphRef = require("../highOrder.js");
var fns = new graphRef.FunctionalExtensions();

describe('FunctionalExtensions - ', function() {
    it('doubler test', function() {
        var x,
            data = [0, 1, 2, 3, 4];
        x = fns.doubler(data);
        assert.equal(x[2], 4);
        assert.equal(data[2], 2);

        x = fns.doublerWithEach(data);
        assert.equal(x[2], 4);
        assert.equal(data[2], 2);

        x = fns.doublerWithMap(data);
        assert.equal(x[2], 4);
        assert.equal(data[2], 2);

        x = fns.doublerWithMapWithNamedFunction(data);
        assert.equal(x[2], 4);
        assert.equal(data[2], 2);
    });
});

describe('FunctionalExtensions - ', function() {
    it('multiplier test', function() {
        var mult = new fns.Multiplier(),
            x,
            data = [0, 1, 2, 3, 4];
        
        mult.makeMultiplier(2);

        x = mult.multiplySomeData(data);
        assert.equal(x[2], 4);
        assert.equal(data[2], 2);

        data = [0, 2, 4, 6, 8];
        x = mult.multiplySomeData(data);
        assert.equal(x[2], 8);
        assert.equal(data[2], 4);
    });
});

describe('FunctionalExtensions - ', function() {
    it('deffered transform test', function() {
        var multiplyBy = function multiplyBy(x) {
                return function(n) {
                    return x * n;
                }
            },
            trans = new fns.DeferredTransform(multiplyBy),
            x,
            data = [0, 1, 2, 3, 4];
        
        trans.partiallyApply(2);

        x = trans.fullyApply(data);
        assert.equal(x[2], 4);
        assert.equal(data[2], 2);

        data = [0, 2, 4, 6, 8];
        x = trans.fullyApply(data);
        assert.equal(x[2], 8);
        assert.equal(data[2], 4);

        power = function fn(x) {
            return function(n) {
                return Math.pow(n, x);
            }
        };

        trans.setTransform(power);
        var squarer = trans.partiallyApply(2);  // x ^ 2

        x = squarer.fullyApply(data);
        assert.equal(x[2], 16);  // 4 ^ 2 = 16

        var cuber = trans.partiallyApply(3);    // x ^ 3
        x = cuber.fullyApply(data);
        assert.equal(x[2], 64);  // 4 ^ 3 = 64

        var fn = power(2);
        assert.equal(_.map(data, fn)[2], 16);  // 4 ^ 2 = 16
        fn = power(3);
        assert.equal(_.map(data, fn)[2], 64);  // 4 ^ 3 = 64
    });
});

describe('FunctionalExtensions - ', function() {
   it('map with test', function() {
      var x,
         data = [0,2,4,6,8],
         power = function fn(x) {
            return function(n) {
                return Math.pow(n, x);
            }
         };

      x = fns.deferMap(power(2)),   // squares
      assert.equal(x(data)[2], 16); // 4 ^ 2 = 16
      assert.equal(x([2])[0], 4); // 2 ^ 2 = 4

      x = fns.deferMap(power(3));   // cubes
      assert.equal(x(data)[2], 64);  // 4 ^ 3 = 64
      assert.equal(x({a: 2, b: 3})[0], 8); // 2 ^ 2 = 4
   });
});

describe('FunctionalExtensions - ', function() {
   it('transpose', function() {
      var data = [
            [0,1,2,3,4],
            ['a','b','c','d','e']
         ],
         transposed = _.zip.apply(_, data);

      assert.equal(data[0][0], 0);
      assert.equal(transposed[0][0], 0);

      assert.equal(data[1][0], 'a');
      assert.equal(transposed[1][0], 1);
   });
});