/// <binding AfterBuild='copy-files' ProjectOpened='default, copy-images' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    //debug = require('gulp-debug'),
    flatten = require('gulp-flatten'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    typescriptCompiler = require('gulp-typescript'),
    del = require('del'),
    path = require('path'),
    shell = require('gulp-shell'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    fs = require('fs'),
    exec = require('child_process').exec;

// Initialize directory paths.
var paths = {
    // Source Directory Paths
    bower: "./bower_components/",
    scripts: "Scripts/",
    styles: "Styles/",
    wwwroot: "./wwwroot/",
    images: "Images/"
};
// Destination Directory Paths
paths.css = paths.wwwroot + "/css/";
paths.fonts = paths.wwwroot + "/fonts/";
paths.img = paths.wwwroot + "/img/";
paths.js = paths.wwwroot + "/js/";
paths.lib = paths.wwwroot + "/lib/";

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('clean-images', function () {
    return del(paths.img);
});

gulp.task("copy-images", ['clean-images'], function () {
    gulp.src(paths.images + '**/*.{png,jpg,ico,gif}')
        .pipe(gulp.dest(paths.img));
});

gulp.task('img:watch', function () {
    gulp.watch(paths.images + '**/*.{png,jpg,ico,gif}', ['copy-images']);
});

gulp.task("clean-lib", function (cb) {
    return del(paths.img);
});

gulp.task("copy-lib", ['clean-lib'], function () {
    var bower = {
        "bootstrap": "bootstrap/dist/**/bootstrap*.{js,map,css}",
        "bootstrap/fonts": "bootstrap/fonts/*.{,eot,svg,ttf,woff,woff2}",
        "jquery": "jquery/dist/jquery*.{js,map}",
        "font-awesome": "components-font-awesome/**/*.{css,otf,eot,svg,ttf,woff,woff2}",
        "moment": "moment/moment.js",
        "knockout": "knockout/dist/*.js",
        "knockout-validation": "knockout-validation/dist/*.js",
        "select2": "select2/dist/**/*.{css,js}",
        "bootstrap-datetimepicker": "eonasdan-bootstrap-datetimepicker/build/**/*.{css,js}",
        "metisMenu": "metismenu/dist/*.{css,js}",
        "morrisjs": "morrisjs/*.{css,js}",
        "raphael": "raphael/*.min.js",
        "datatables.net": "datatables.net/js/*.js",
        "bootstrap-tags": "bootstrap-tags/dist/{css,js}/*.{css,js}"

    };

    for (var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
            .pipe(gulp.dest(paths.lib + destinationDir));
    }
});

gulp.task("copy-files", ['copy-lib', 'ts', 'copy-js']);

gulp.task("copy-js", function () {
    gulp.src(paths.scripts + "*.js")
        .pipe(gulp.dest(paths.js));
});

gulp.task('js:watch', function () {
    gulp.watch(paths.scripts + '/*.js', ['copy-js']);
});


gulp.task("sass", function () {
    // get the files from the root
    gulp.src(paths.styles + '/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.css));
});

gulp.task('sass:watch', function () {
    gulp.watch([paths.styles + '/*.scss'], ['sass']);
});


gulp.task('ts:local', function () {
    // now compile the individual page files
    var individualFileTypescriptProject = typescriptCompiler.createProject('tsconfig.json');
    var individualTsResult = gulp.src([paths.scripts + '/*.ts', '!' + paths.scripts + '/{coalesce,Ko,ko}*.ts'])
        .pipe(sourcemaps.init())
        .pipe(individualFileTypescriptProject());

    individualTsResult.dts.pipe(gulp.dest(paths.js));

    individualTsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js));
});

gulp.task('ts', ['ts:local'], function () {
    // compile the root generated code into an app.js file
    var rootAppJsProject = typescriptCompiler.createProject('tsconfig.json', { outFile: 'app.js' });
    var rootApp = gulp.src([paths.scripts + 'viewmodels.generated.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(rootAppJsProject());

    rootApp.dts
        .pipe(gulp.dest(paths.js));

    rootApp.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js));
});

gulp.task("copy-ts", ['ts'], function () {
    gulp.src(paths.scripts + "*.{ts,js.map}")
        .pipe(gulp.dest(paths.js));
});

gulp.task('ts:watch', function () {
    gulp.watch([paths.scripts + '/**/*.ts'], ['ts:local']);
    gulp.watch([paths.scripts + '/Partials/*.ts'], ['ts']);
});

gulp.task('watch', ['sass:watch', 'ts:watch', 'js:watch', 'img:watch'], function () {
});

gulp.task('default', ['copy-lib', 'sass', 'ts', 'watch'], function () {
});

gulp.task('coalesce', shell.task([`dotnet coalesce`], { verbose: true }));