/* jshint node: true, browser: true, esnext: true */

var math = require('mathjs');

(function () {

  "use strict";

  math.import({
    // For functions that return multiple values, getdata
    // retrieves and returns each value.
    getdata: function getdata(key, object) {
      return math.eval(key, object);
    },
    // A shortcut to retrieve the y output.
    outy: function outy(object) {
      return math.eval("outy", object);
    },
    // A shortcut to retrieve the n output.
    outn: function outn(object) {
      return math.eval("outn", object);
    },
    // A shortcut to retrieve the q output.
    outq: function outq(object) {
      return math.eval("outq", object);
    },
    // A shortcut to retrieve the r output.
    outr: function outr(object) {
      return math.eval("outr", object);
    },
    // A shortcut to retrieve the qn output.
    outqn: function outqn(object) {
      return math.eval("outqn", object);
    },
    // A shortcut to retrieve the rn output.
    outrn: function outrn(object) {
      return math.eval("outrn", object);
    },
    // A shortcut to retrieve the z output.
    outz: function outz(object) {
      return math.eval("outz", object);
    },
    // A shortcut to retrieve the d output.
    outd: function outd(object) {
      return math.eval("outd", object);
    },
    // A shortcut to retrieve the dn output.
    outdn: function outdn(object) {
      return math.eval("outdn", object);
    },
    // Stores a header token for use with importurl.
    settoken: function settoken(key, token) {
      localStorage.setItem(key, token);
      return token;
    },
    // Retrieves token for use with importurl. 
    gettoken: function gettoken(key) {
      return localStorage.getItem(key);
    },
    // Returns the length of an array as a number.
    length: function length(array) {
      return array.length;
    }
  }, {
    wrap: true
  });

}());