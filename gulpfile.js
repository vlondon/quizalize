var gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    webpack = require('gulp-webpack');





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


// Scripts
gulp.task('eslint', function () {
    return gulp.src(['src/main/scripts/**/*.{js, jsx}'])
        .pipe($.plumber(plumberConfig))
        .pipe($.eslint('./.eslintrc'))
        .pipe($.eslint.format());

});




// Clean
gulp.task('clean', function (cb) {
    del([
        'public/js/**',
    ], cb);
});


// Watch
gulp.task('watch', ['clean', 'webpack'], function () {
    isWatch = true;
    // Watch for changes in `app` folder
    // gulp.watch([
    //     'src/main/webapp/*.html',
    //     'src/main/webapp/styles/**/*.css',
    //     'src/main/scripts/**/*.js',
    //     'src/main/webapp/images/**/*'
    // ], function(event) {
    //     return gulp.src(event.path);
    // });
    //
    // // Watch .scss files
    // gulp.watch('src/main/scss/**/*.scss', ['styles']);
    //
    // // Watch .js files
    // gulp.watch('src/main/scripts/**/*.js', ['eslint']); //, 'karma'

    // gulp.watch('src/main/scripts/**/*.jsx', ['eslint']);


    // Watch image files
    //gulp.watch('src/main/webapp/images/**/*', ['images']);


});
