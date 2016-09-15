/* global katex: false */
/* jshint node: true, browser: true, esnext: true */

var math = require('mathjs');

(function () {

  "use strict";

  math.import({

    polystring: function polystring() {
      var sb, 
          sbuffer = [], 
          sbfinal = 'f(z) = ',
          coeffArray,
          expArray,
          firstIndex,
          exponent,
          coeff,
          variable = 'z',
          _formatString;

      for (var j = 0; j < arguments.length; j+=2) {
        sb = '';
        firstIndex = 0;
        coeffArray = arguments[j];
        expArray = arguments[j + 1];

        while (coeffArray[firstIndex] === 0) {
          firstIndex++;
        }

        if (expArray[firstIndex] === 0) {
          exponent = '';
          variable = '';
        } else if (expArray[firstIndex] === -1) {
          exponent = '';
        } else {
          exponent = '^' + -1 * expArray[firstIndex];
        }

        // Format the first non-zero element.
        if (coeffArray[firstIndex] !== 0) {
          if (variable === '') {
            coeff = coeffArray[firstIndex];
          } else {
            coeff = math.abs(coeffArray[firstIndex]) === 1 ? '' : coeffArray[firstIndex];
          }
          sb += coeff + variable + exponent;
        }

        firstIndex++;

        for (var i = firstIndex; i < expArray.length; i++) {
          variable = 'z';

          // Format the exponent.
          if (expArray[i] === 0) {
            exponent = '';
            variable = '';
          } else if (expArray[i] === -1) {
            exponent = '';
          } else {
            exponent = '^' + -1 * expArray[i];
          }

          if (coeffArray[i] !== 0) {
            if (coeffArray[i] > 0) {
              if (variable === '') {
                coeff = coeffArray[i];
              } else {
                coeff = coeffArray[i] === 1 ? '' : coeffArray[i];
              }
              sb += ' + ' + coeff + variable + exponent;
            } else if (coeffArray[i] < 0) {
              if (variable === '') {
                coeff = math.abs(coeffArray[i]);
              } else {
                coeff = coeffArray[i] == -1 ? '' : math.abs(coeffArray[i]);
              }
              sb += ' - ' + coeff + variable + exponent;
            }
          }
        }
        sbuffer.push('(' + sb + ')');
      }

      if (sbuffer.length === 1) {
        sbfinal = sbfinal + sbuffer[0];
      } else if (sbuffer.length === 2) {
        sbfinal = sbfinal + sbuffer[0] + '/' + sbuffer[1];
      } else if (sbuffer.length === 3) {
        sbfinal = sbfinal + sbuffer[0] + '+' + sbuffer[1] + '/' + sbuffer[2];
      } else {
        return 'There was a problem converting the arguments into a string.';
      }

      return katex.renderToString(math.parse(sbfinal).toTex({implicit: 'hide', parenthesis: 'auto'}));
    }
  }, {
    wrap: true
  });
}());