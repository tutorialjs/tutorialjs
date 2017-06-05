const gulp = require("gulp"),
    path   = require("path"),
    stripDebug = require('gulp-strip-debug'),
    optimizejs = require('gulp-optimize-js'),
    autoprefixer = require('gulp-autoprefixer'),
    sass    = require('gulp-sass'),
    watch   = require('gulp-watch'),
    uglify  = require("gulp-uglify"),
    rename  = require("gulp-rename"),
    cssnano = require('gulp-cssnano'),
    babel   = require("gulp-babel");

gulp.task("default", () => {
    return gulp.src(path.join(__dirname, "/src/tutorial.js"))
        .pipe(babel({
            presets: ["flow", "es2015", "es2017"],
            plugins: ["transform-object-rest-spread"]
        }))
        .pipe(gulp.dest(path.join(__dirname, "/dist")))
});

gulp.task('sass', function () {
  return gulp.src(path.join(__dirname, "/src/tutorial.scss"))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join(__dirname, "/dist")));
});

gulp.task("minifyJS", () => {
    return gulp.src(path.join(__dirname, "/src/tutorial.js"))
        .pipe(babel({
            presets: ["flow", "es2015", "es2017"],
            plugins: ["transform-object-rest-spread"]

        }))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(rename("tutorial.min.js"))
        .pipe(gulp.dest(path.join(__dirname, "/dist")))
});

gulp.task('minifyCss', function () {
    return gulp.src(path.join(__dirname, "/src/tutorial.scss"))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename("tutorial.min.css"))
        .pipe(gulp.dest(path.join(__dirname, "/dist")));
});

gulp.task("production", function() {
    gulp.start("minifyJS");
    gulp.start("minifyCss");
});

gulp.task("watch", () => {
    return watch([path.join(__dirname, "/src/tutorial.js"), path.join(__dirname, "/src/tutorial.scss")], function() {
        gulp.start("default");
        gulp.start("sass");
    })
});