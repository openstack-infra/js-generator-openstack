var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc3');

gulp.task('default', function (cb) {
    gulp.src(['./generators/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});
