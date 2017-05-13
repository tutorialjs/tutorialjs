const gulp = require("gulp"),
    path   = require("path"),
    stripDebug = require('gulp-strip-debug'),
    optimizejs = require('gulp-optimize-js'),
    sass   = require('gulp-sass'),
    watch  = require('gulp-watch'),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    babel  = require("gulp-babel");

gulp.task("default", () => {
    return gulp.src(path.join(__dirname, "/src/tutorial.js"))
        .pipe(babel({
            presets: ["flow", "es2015"]
        }))
        .pipe(gulp.dest(path.join(__dirname, "/dist")))
});

gulp.task('sass', function () {
  return gulp.src(path.join(__dirname, "/src/tutorial.scss"))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.join(__dirname, "/dist")));
});

gulp.task("production", () => {
    return gulp.src(path.join(__dirname, "/src/tutorial.js"))
        .pipe(babel({
            presets: ["flow", "es2015"]
        }))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(rename("tutorial.min.js"))
        .pipe(gulp.dest(path.join(__dirname, "/dist")))
});

gulp.task("watch", () => {
    return watch([path.join(__dirname, "/src/tutorial.js"), path.join(__dirname, "/src/tutorial.scss")], function() {
        gulp.start("default");
        gulp.start("sass");
    })
});