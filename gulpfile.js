var gulp = require("gulp"),
  webpack = require("gulp-webpack"),
  babel= require("gulp-babel"),
  clean = require("gulp-clean"),
  uglify = require("gulp-uglify"),
  plumber = require('gulp-plumber');

var path = require("path"),
  del = require('del');

gulp.task("clean:dist", function() {
  return gulp.src("dist", { read: false }).pipe(clean());
});

gulp.task("clean:tmp", function() {
  return gulp.src("tmp", { read: false }).pipe(clean());
});

gulp.task("js:babel", function() {
  return gulp.src("src/**/*.js")
    .pipe(plumber())
    .pipe(babel({
        presets: ['es2015']
     }))
    .pipe(gulp.dest("tmp"));
});

gulp.task("js:webpack", ["js:babel", "clean:dist"], function() {  
  return gulp.src("tmp/**/*.js")
    .pipe(plumber())
    .pipe(webpack({
      entry: path.resolve(__dirname, "tmp", "template.js"),
      output: {
        filename: 'template.js',
        library: 'simpleTemplate',
        libraryTarget: 'umd',
        umdNamedDefine: true
      }
    }))
    .pipe(gulp.dest("dist"));
});

gulp.task("js:optimize", ["js:webpack"], function() {
  return gulp.src("dist/template.js")
    .pipe(plumber())
    .pipe(uglify({preserveComments: 'some', }))
    .pipe(gulp.dest("dist/min"));
});

gulp.task("build", ["js:optimize"], function () {
  return gulp.src("tmp", { read: false }).pipe(clean());
});

gulp.task("default", ["build"], function() {
  console.log("All done.");  
});

gulp.task("dev", ["build"], function() {
  var watcher = gulp.watch('src/**/*.js', ['default']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }); 
  console.log("Now, watching file change...");
});
