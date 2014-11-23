// See: <url:http://en.wikipedia.org/w/index.php?title=
// Spline_interpolation&oldid=620360086>

/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var square, initAB, createSa, createSb, createSc, createSd, createK,
    initAB, solve = require('tridiagonal-solve');

square = function (x) {
    return x * x;
};

createSa = function (px, n) {
    var sa = [], i;

    for (i = 1; i <= n; i += 1) {
        sa[i - 1] = 1 / (px[i] - px[i - 1]);
    }

    return sa;
};

createSb = function (px, n) {
    var sb = [], i;

    sb[0] = 2 / (px[1] - px[0]);
    sb[n] = 2 / (px[n] - px[n - 1]);

    for (i = 1; i < n; i += 1) {
        sb[i] = 2 * (1 / (px[i] - px[i - 1]) + 1 / (px[i + 1] - px[i]));
    }

    return sb;
};

createSc = function (px, n) {
    var sc = [], i;

    for (i = 0; i < n; i += 1) {
        sc[i] = 1 / (px[i + 1] - px[i]);
    }

    return sc;
};

createSd = function (px, py, n) {
    var sd = [], i;

    sd[0] = 3 * (py[1] - py[0]) / square(px[1] - px[0]);
    sd[n] = 3 * (py[n] - py[n - 1]) / square(px[n] - px[n - 1]);
    for (i = 1; i < n; i += 1) {
        sd[i] = 3 * ((py[i] - py[i - 1]) / square(px[i] - px[i - 1]) +
                     (py[i + 1] - py[i]) / square(px[i + 1] - px[i]));
    }

    return sd;
};

createK = function (px, py, n) {
    return solve(createSa(px, n),
                 createSb(px, n),
                 createSc(px, n),
                 createSd(px, py, n));
};

initAB = function (a, b, px, py, n) {
    var i, k = createK(px, py, n);

    for (i = 1; i <= n; i += 1) {
        a[i] = k[i - 1] * (px[i] - px[i - 1]) - (py[i] - py[i - 1]);
        b[i] = -k[i] * (px[i] - px[i - 1]) + (py[i] - py[i - 1]);
    }
};

module.exports = function (points) {
    var n = points.length - 1,
        px,
        py,
        q,
        a = [],
        b = [];

    if (points.length === 0) {
        return function () {
            return 0;
        };
    }

    if (points.length === 1) {
        return function () {
            return points[0][1];
        };
    }

    points = points.sort(function (a, b) {
        return a[0] - b[0];
    });

    // Interpolating polynomial for px[i-1] <= x <= px[i] where 1 <= i <= n.
    q = function (i, x) {
        var t = (x - px[i - 1]) / (px[i] - px[i - 1]);

        return ((1 - t) * py[i - 1] +
                t * py[i] +
                t * (1 - t) * (a[i] * (1 - t) + b[i] * t));
    };

    px = points.map(function (point) { return point[0]; });
    py = points.map(function (point) { return point[1]; });

    initAB(a, b, px, py, n);

    return function (x) {
        var i;

        if (x < px[0]) {
            return q(1, x); // extrapolates
        }

        for (i = 1; i <= n; i += 1) {
            if (x < px[i]) {
                return q(i, x);
            }
        }

        return q(n, x); // extrapolates
    };
};
