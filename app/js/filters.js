/**
 * Implements a 1D transposed direct form II digital filter structure.
 *
 * Supports FIR and IIR filters and inital and final conditions.
 *
 * A frequency domain description of this filter is as follows:
 *
 *              b(0) + b(1)z^-1 + ... + b(nb)z^-nb
 *     Y(z) = ______________________________________ * X(z)
 *                1 + a(1)z^-1 + ... +a(na)z^-na
 *
 * Throws range error if a(0) = 0 or if initial condition sequence z
 * is not equal to the larger of either length of a or the length of b.
 *
 * Example usage - Calculate the impulse response of the following filter:
 *
 *     x = impulse(141, 20);
 *     b = [1];
 *     a = [1, -1, 0.9];
 *     h = filter1d(b, a, x);
 *     y = outy(h);  // The filter response.
 *     z = outz(h);  // The final conditions of the filter.
 *     s = math.sum(math.abs(y)); // The magnitude of the response.
 *
 * TODO: Normalize all coefficients if a[0] not equal to 1.
 *
 */

/* jshint node: true, browser: true, esnext: true */

var math = require('mathjs');

(function () {
  
"use strict";

  math.import({

    filter1d: function filter1d(b, a, x, z) {
      var ai, bi, y, n, alen, blen;
      alen = a.length;
      blen = b.length;
      if (a[0] === 0) {
        throw new RangeError("The coefficient a[0] can not be 0.");
      }
      n = Math.max(alen, blen);
      if (z === undefined) {
        z = new Array(n).fill(0);
      } else if (z.length != n) {
        throw new RangeError("The intial condition sequence z is the wrong size.");
      }

      if (alen > blen) {
        bi = b.concat(new Array(alen - blen).fill(0));
        ai = a.slice();
      } else if (blen > alen) {
        ai = a.concat(new Array(alen - blen).fill(0));
        bi = b.slice();
      } else {
        ai = a.slice();
        bi = b.slice();
      }

      y = new Array(x.length).fill(0);
      for (var i = 0; i < y.length; i++) {
        y[i] = bi[0] * x[i] + z[0];
        for (var j = 1; j < n; j++) {
          z[j - 1] = bi[j] * x[i] + z[j] - ai[j] * y[i];
        }
      }
      return {
        outy: y,
        outz: z
      };
    }
  }, {
    wrap: true
  });

}());