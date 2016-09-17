/* jshint node: true, browser: true, esnext: true */

'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

gulp.task('bundle', function () {
  return Promise.all([
    bundle(srcDir.path('background.js'), destDir.path('background.js')),
  ]);
});

gulp.task('environment', function () {
  var configFile = 'config/env_' + utils.getEnvName() + '.json';
  projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
  var beepOnError = function (done) {
    return function (err) {
      if (err) {
        utils.beepSound();
      }
      done(err);
    };
  };

  watch('src/**/*.js', batch(function (events, done) {
    gulp.start('bundle', beepOnError(done));
  }));
});

gulp.task('build', ['bundle', 'environment']);
