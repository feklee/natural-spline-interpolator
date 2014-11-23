/*jslint node: true, maxerr: 50, maxlen: 80 */

/*global define */

'use strict';

var assert = require('assert'),
    interpolator = require('./node_main.js'),
    util = require('util'),
    assertNumEqual,
    f;

assertNumEqual = function (actual, expected, epsilon) {
    if (epsilon === undefined) {
        epsilon = 0.00001; // small but arbitrary
    }
    return assert(Math.abs(actual - expected) < epsilon,
                  util.format('|%d - %d| < epsilon', actual, expected));
};

// No points:
f = interpolator([]);
[1.5, 0, -0.7].forEach(function (x) {
    assertNumEqual(f(x), 0);
});

// One point:
f = interpolator([[0, 0]]);
[1500, 0, -0.72342].forEach(function (x) {
    assertNumEqual(f(x), 0);
});

f = interpolator([[0, 1.7]]);
[234, 0, -7234.43].forEach(function (x) {
    assertNumEqual(f(x), 1.7);
});

f = interpolator([[0, -23432.4]]);
[234, 0, -7234.43].forEach(function (x) {
    assertNumEqual(f(x), -23432.4);
});

// Two points with the same y value:
f = interpolator([[-3.4, 1.5], [1, 1.5]]);
[234, 0, -7234.43].forEach(function (x) {
    assertNumEqual(f(x), 1.5);
});

// Two points, describing a slope:
f = interpolator([[-0.5, 3.5], [-70, 2]]);
assertNumEqual(f(-0.5), 3.5);
assertNumEqual(f(-70), 2);

f = interpolator([[4, 2], [5, 2.5]]);
[-2.5, 0, 4.5, 10].forEach(function (x) {
    assertNumEqual(f(x), x / 2);
});

// Curvy (expected results from Maxima 5's `cspline`):
f = interpolator([[-1, 4], [0, 2], [1, 6]]);
assertNumEqual(f(0), 2);
assertNumEqual(f(-1), 4);
assertNumEqual(f(1), 6);
assertNumEqual(f(1.5), 8.5625);
assertNumEqual(f(-70.54), -504176.1179960002);
assertNumEqual(f(8.5), -585.5625);

f = interpolator([[-0.5, 3.5], [-70, 2], [2.5, 6]]);
assertNumEqual(f(-0.5), 3.5);
assertNumEqual(f(-70), 2);
assertNumEqual(f(2.5), 6);

f = interpolator([[-0.5, 3.5], [-70, 2], [2.5, 6], [-8, -4.3]]);
assertNumEqual(f(-0.5), 3.5);
assertNumEqual(f(-70), 2);
assertNumEqual(f(2.5), 6);
assertNumEqual(f(-8), -4.3);
assertNumEqual(f(0), 3.946516781492843);
assertNumEqual(f(-3.543), 0.44693872665888);
assertNumEqual(f(17.243), 31.62305233695833);
assertNumEqual(f(2343.2), 5.5683319320835844 * Math.pow(10, 7));

console.log('Passed');
