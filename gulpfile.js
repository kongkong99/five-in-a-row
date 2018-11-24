const gulp = require('gulp'),
    babel = require('gulp-babel'),
    scss = require('gulp-sass'),
    livereload = require('gulp-livereload');


gulp.task('es6', () => {
    return gulp.src('app/es6/*.js')
        .pipe(babel())
        .pipe(gulp.dest('app/js'))
        .pipe(livereload());
});

gulp.task('scss', () => {
    return gulp.src('app/scss/*.scss')
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(gulp.dest('app/css'))
        .pipe(livereload())
});

gulp.task('watch',() =>{
    livereload.listen();
    gulp.watch('app/es6/*.js',['es6']);
    gulp.watch('app/scss/*.scss',['scss']);
})

