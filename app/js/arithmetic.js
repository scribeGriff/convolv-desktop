/* jshint node: true, browser: true, esnext: true */

var math = require('mathjs');

(function () {

  "use strict";

  math.import({

    addseqs: function addseqs(seq1, seq2, pos1, pos2) {
      var start, end, n, y1, y1f, y2, y2f, y, _seq1, _seq2, _pos1, _pos2;
      _seq1 = math.number(seq1);
      _seq2 = math.number(seq2);
      if (pos1 === undefined) {
        _pos1 = new Array(_seq1.length).fill(0).map(function (x, i) { 
          return i; 
        });
      } else {
        _pos1 = math.number(pos1);
      }

      if (pos2 === undefined) {
        _pos2 = new Array(_seq2.length).fill(0).map(function (x, i) { 
          return i; 
        });
      } else {
        _pos2 = math.number(pos2);
      }
      start = math.min(math.min(_pos1), math.min(_pos2));
      end = math.max(math.max(_pos1), math.max(_pos2));
      n = new Array(end - start + 1).fill(0).map(function(x, i) { return i + start; });
      y1 = new Array(n.length).fill(0);
      y2 = new Array(n.length).fill(0);
      y1.splice(n.indexOf(math.min(_pos1)), _seq1.length, _seq1);
      y1f = y1.join(',').split(',').map(Number);
      y2.splice(n.indexOf(math.min(_pos2)), seq2.length, _seq2);
      y2f = y2.join(',').split(',').map(Number);
      y = new Array(n.length).fill(0).map(function(x, i) { return y1f[i] + y2f[i]; });
      return {
        outy: y, 
        outn: n
      };
    },

    subseqs: function subseqs(seq1, seq2, pos1, pos2) {
      var start, end, n, y1, y1f, y2, y2f, y, _seq1, _seq2, _pos1, _pos2;
      _seq1 = math.number(seq1);
      _seq2 = math.number(seq2);
      if (pos1 === undefined) {
        _pos1 = new Array(_seq1.length).fill(0).map(function (x, i) { 
          return i; 
        });
      } else {
        _pos1 = math.number(pos1);
      }

      if (pos2 === undefined) {
        _pos2 = new Array(_seq2.length).fill(0).map(function (x, i) { 
          return i; 
        });
      } else {
        _pos2 = math.number(pos2);
      }
      start = math.min(math.min(_pos1), math.min(_pos2));
      end = math.max(math.max(_pos1), math.max(_pos2));
      n = new Array(end - start + 1).fill(0).map(function(x, i) { return i + start; });
      y1 = new Array(n.length).fill(0);
      y2 = new Array(n.length).fill(0);
      y1.splice(n.indexOf(math.min(_pos1)), _seq1.length, _seq1);
      y1f = y1.join(',').split(',').map(Number);
      y2.splice(n.indexOf(math.min(_pos2)), seq2.length, _seq2);
      y2f = y2.join(',').split(',').map(Number);
      y = new Array(n.length).fill(0).map(function(x, i) { return y1f[i] - y2f[i]; });
      return {
        outy: y, 
        outn: n
      };
    }
  }, {
    wrap: true
  });

}());