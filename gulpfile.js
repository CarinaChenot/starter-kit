const gulp         = require('gulp')
const plumber      = require('gulp-plumber')
const rename       = require('gulp-rename')
const notify       = require('gulp-notify')
const connect      = require('gulp-connect')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps   = require('gulp-sourcemaps')
const concat       = require('gulp-concat')
const uglify       = require('gulp-uglify')
const cleanCSS     = require('gulp-clean-css')
const sass         = require('gulp-sass')

// Connect task
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    })
})

// CSS task
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(plumber({errorHandler: notify.onError('SASS Error: <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename(function (path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest('src/css/'))
        .pipe(connect.reload())
        .pipe(notify('SASS compiled: <%= file.relative %>'))
})


// JS task
gulp.task('js', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message)
        this.emit('end')
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('src/js/'))
})

// Wath task
gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.scss", ['sass'])
    gulp.watch("src/js/**/*.js, '!js/**/*.min.js", ['js'])
})

gulp.task('default', ['connect', 'watch'], function() {

})
