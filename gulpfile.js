const gulp = require("gulp"),
    path   = require("path"),
    flowRemoveTypes = require('flow-remove-types'),
    optimizejs = require('gulp-optimize-js'),
    through = require('through2'),
    sass   = require('gulp-sass'),
    watch  = require('gulp-watch'),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    babel  = require("gulp-babel");

gulp.task("default", () => {
    return gulp.src(path.join(__dirname, "/src/tutorial.js"))
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(through.obj((file, enc, cb) => {
            file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
            cb(null, file);
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
            presets: ["es2015"]
        }))
        .pipe(through.obj((file, enc, cb) => {
            file.contents = new Buffer(flowRemoveTypes(file.contents.toString('utf8')).toString())
            cb(null, file);
        }))
        .pipe(uglify())
        .pipe(optimizejs())
        .pipe(rename("tutorial.min.js"))
        .pipe(gulp.dest(path.join(__dirname, "/dist")))
});

gulp.task("watch", () => {
    return watch(path.join(__dirname, "/src/tutorial.js"), function() {
        gulp.start("default");
        gulp.start("sass");
    })
});