'use strict';

var gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha');

var paths = {
  js: ['gulpfile.js', 'lib/**/*.js'],
  test: ['test/**/*.js']
};

gulp.task('test', function () {
  return gulp.src(paths.test)
    .pipe(mocha());
});

gulp.task('coverage', function (done) {
  return gulp.src(paths.js)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(paths.test)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            // INCREASE TO 100% ON COMPLETION
            global: {
              statements: 95,
              branches: 95,
              lines: 95,
              functions: 95
            },
            each: {
              statements: 95,
              branches: 95,
              lines: 95
            }
          }
        }))
        .on('end', done);
    });
});

gulp.task('watch-test', function () {
  gulp.watch(Array.prototype.concat.apply([], [paths.js, paths.test]), ['test']);
});

gulp.task('default', ['watch-test']);