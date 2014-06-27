var gulp = require('gulp'),
    semverify = require('gulp-semverify'),
    mocha = require('gulp-mocha');

gulp.task('tests', function() {
    gulp.src("./tests/**/*.js", {read : false})
        .pipe(mocha());
});

gulp.task('semver-policy', function() {

    gulp.src(__dirname + "/*.json")
        .pipe(semverify({policy : "^X.Y.Z"}));
});
