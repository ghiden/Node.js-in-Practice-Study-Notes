var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var cache = require('gulp-cached');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

gulp.task('watch', ['es6'], function() {
  watch('./es6/*.es6', function() {
    gulp.start('es6');
  });
});

gulp.task('es6', function() {
  return gulp.src('./es6/*.es6')
    .pipe(cache('es6'))
    .pipe(plumber())
    .pipe(babel())
    .pipe(rename(function(path) {
      path.extname = '.js';
    }))
    .pipe(gulp.dest('generated-js'));
});

gulp.task('default', ['es6']);
