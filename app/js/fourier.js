/* jshint node: true, browser: true, esnext: true */

var math = require('mathjs');

(function () {

  "use strict";

  var radix2, dft, iradix2, idft, formatData;
  const FSMALL = 14;

  math.import({

    /**
     * fft()
     * 
     * Computes the FFT of an array of arbitrary length.
     * @param   {Array}  rcdata real or complex data
     * @param   {Number} N      Order of FFT (optional)
     * @returns {Array}  FFT of input data as a complex array.
     */
    fft: function fft(rcdata, N) {
      var _n, _cxdata;

      _cxdata = formatData(rcdata, N);
      _n = _cxdata.length;

      if ((_n & -_n) === _n) {
        // If true, use O(nlogn) algorithm,
        return radix2(_cxdata);
      } else {
        // else use O(n^2) algorithm.
        return dft(_cxdata);
      }
    },

    /** 
     * ifft()
     * 
     * Computes the inverse FFT of an array of arbitrary length.
     * @param   {Array}  rcdata real or complex data
     * @param   {Number} N      order of IFFT (optional)
     * @returns {Array}  IFFT of input data as a complex array
     */
    ifft: function ifft(rcdata, N) {
      var _n, _cxdata;

      _cxdata = formatData(rcdata, N);
      _n = _cxdata.length;

      if ((_n & -_n) === _n) {
        // If true, use O(nlogn) algorithm,
        return iradix2(_cxdata);
      } else {
        // else use O(n^2) algorithm.
        return idft(_cxdata);
      }
    },

    /**
     * fsps()
     * 
     * 
     */
    fsps: function fsps(data, kval, cycles, fraction) {
      var L = data.length,
          y = new Array(L),
          re = new Array(L),
          im = new Array(L),
          polar = new Array(L),
          r = new Array(L),
          phi = new Array(L),
          _kval, _cycles, _fraction,
          N, coeff, q, kth, wk, kp;

      _kval = kval !== undefined ? kval : 3;
      _cycles = cycles !== undefined ? cycles : 1;
      _fraction = fraction !== undefined ? fraction : 1;
      //User may define a period less than the length of the waveform.
      N = Math.trunc(L * _fraction / _cycles);
      kp = 2 * Math.PI / N;
      //The Fourier series coefficients are computed using a FFT.
      coeff = math.fft(data.slice(0, N));
      for (var n = 0; n < L; n++) {
        q = math.complex(0, 0);
        for (var k = 1; k <= _kval; k++) {
          kth = kp * n * k;
          wk = math.complex(math.cos(kth), math.sin(kth));
          q = math.add(q, math.multiply(wk, coeff[k]));
        }
        y[n] = math.round(math.add(math.multiply(coeff[0], 1 / N), math.multiply(q, 2 / N)), FSMALL);
      }

      return y;

    }
  }, {
    wrap: true
  });

  /**
   * Formats the input data for FFT/IFFT
   * @param   {Array}  rcdata real or complex data
   * @param   {Number} N      optional: number of points of FFT/IFFT
   * @returns {Array}  Array of length N corrected data
   */
  formatData = function formatData(rcdata, N) {
    var len, _rcdata;
    len = rcdata.length;

    if (N !== undefined && N !== len) {
      if (N > len) {
        _rcdata = rcdata.concat(new Array(N - len).fill(0));
      } else {
        _rcdata = rcdata.slice(0, N);
      }
    } else {
      _rcdata = rcdata;
    }
    return _rcdata; 
  };

  /**
   * Performs an O(nlogn) radix2 fft on the input data.
   * @param   {Array} _data complex array for FFT calculation
   * @returns {Array} transformed version of _data
   */
  radix2 = function radix2(_data) {
    var _n = _data.length;
    if (_n === 1) return _data;

    // Perform fft of even terms recursively.
    var even = new Array(_n >> 1);
    for (var ke = 0; ke < _n/2; ke++) {
      even[ke] = _data[2 * ke];
    }
    var q = radix2(even);

    // Perform fft of odd terms recursively.
    var odd = new Array(_n >> 1);
    for (var ko = 0; ko < _n/2; ko++) {
      odd[ko] = _data[2 * ko + 1];
    }
    var r = radix2(odd);

    // Merging formula for combining 2 N/2-point DFTs
    // into one N-point DFT.
    var y = new Array(_n);
    for (var k = 0; k < _n/2; k++) {
      var kth = -2 * k * math.PI / _n;
      var wk = math.complex(math.cos(kth), math.sin(kth));
      y[k] = math.round(math.add(q[k], (math.multiply(wk, r[k]))), FSMALL);
      y[k + (_n >> 1)] = math.round(math.subtract(q[k], (math.multiply(wk, r[k]))), FSMALL);
    }
    return y;
  };

  /**
   * Performs a "brute force" discrete fourier transform of the input data as 
   * given by the expression: X(k) = sumN [x(n) * WN(nk)]
   * @param   {Array} _data complex array for DFT calculation
   * @returns {Array} transformed version of _data
   */
  dft = function dft(_data) {
    var _n = _data.length;
    var y = new Array(_n);
    for (var k = 0; k < _n; k++) {
      var q = math.complex(0, 0);
      for (var j = 0; j < _n; j++) {
        var kth = -2 * k * j * math.PI / _n;
        var wk = math.complex(math.cos(kth), math.sin(kth));
        q = math.add(q, (math.multiply(wk, _data[j])));
      }
      y[k] = math.round(q, FSMALL);
    }
    return y;
  };

  /**
   * Performs an O(nlogn) radix2 inverse FFT on the input data.
   * @param   {Array} _data complex array for IFFT calculation
   * @returns {Array} inverse transformed version of _data
   */
  iradix2 = function iradix2(_data) {
    var _n = _data.length;
    var x = new Array(_n);
    // Take the conjugate of the input data.
    for (var i = 0; i < _n; i++) {
      x[i] = math.conj(_data[i]);
    }

    // Compute an FFT of the conjugated data.
    var y = math.fft(x);

    // Take the conjugate again of the transformed data and scale by 1/N.
    for (var j = 0; j < _n; j++) {
      y[j] = math.round(math.multiply(math.conj(y[j]), 1 / _n), FSMALL);
    }
    return y;
  };

  /**
   * Performs a "brute force" discrete inverse fourier transform of the input data 
   * as given by the expression: x(n) = 1/N * sum(k)[X(k) * WN(-nk)]
   * @param   {Array} _data complex array for IFFT calculation
   * @returns {Array} inverse transformed version of _data
   */
  idft = function idft(_data) {
    var _n = _data.length;
    var y = new Array(_n);
    for (var k = 0; k < _n; k++) {
      var q = math.complex(0, 0);
      for (var j = 0; j < _n; j++) {
        var kth = 2 * k * j * math.PI / _n;
        var wk = math.complex(math.cos(kth), math.sin(kth));
        q = math.add(q, (math.multiply(wk, _data[j])));
      }
      y[k] = math.round(math.multiply(q, 1 / _n), FSMALL);
    }
    return y;
  };

}());
