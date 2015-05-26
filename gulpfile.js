var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();
var webpack = require('gulp-webpack');
var ngAnnotate = require('gulp-ng-annotate');


gulp.task('webpack', function() {

    var webpackSettings = require('./webpack.config.dev.js');

    webpackSettings.watch = true;

    return gulp.src('scripts/quiz.js')
        .pipe(webpack( webpackSettings ))
        .pipe(gulp.dest('public/js'));
});

gulp.task('webpack-prod', function() {

    return gulp.src('scripts/quiz.js')
        .pipe(webpack( require('./webpack.config.prod.js') ))
        .pipe(gulp.dest('public/js'));

});

gulp.task('webpack-dev', function() {

    return gulp.src('scripts/quiz.js')
        .pipe(webpack( require('./webpack.config.dev.js') ))
        .pipe(gulp.dest('public/js'));

});

gulp.task('minify', ['webpack-prod'], function(){
    return gulp.src('public/js/*.js')
    .pipe(ngAnnotate())
    .pipe($.uglify({
        compress: {
            'drop_console': true
        }
    }))
    .pipe(gulp.dest('public/js'));
});


// Scripts
// gulp.task('eslint', function () {
//     return gulp.src(['src/main/scripts/**/*.{js, jsx}'])
//         .pipe($.plumber(plumberConfig))
//         .pipe($.eslint('./.eslintrc'))
//         .pipe($.eslint.format());
//
// });



// Clean
gulp.task('clean', function (cb) {
    del([
        'public/js/**'
    ], cb);
});


// Watch
gulp.task('watch', ['clean', 'webpack']);
gulp.task('dev', ['clean', 'webpack-dev']);
gulp.task('default', ['clean', 'webpack-prod', 'minify']);
