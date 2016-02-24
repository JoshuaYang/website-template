var gulp = require('gulp');
var swig = require('gulp-swig');
var data = require('gulp-data');
var compass = require( 'gulp-for-compass' );
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');
var inject = require('gulp-inject');
var htmlmin = require('gulp-htmlmin');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var copy = require('gulp-copy');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var zip = require('gulp-zip');
var watchify = require('watchify');


var devPath = {
    html: 'dev/*.html',
    sass: 'dev/style/**/*.{scss,sass}',
    js: 'dev/script/**/*',
    img: 'dev/image/**/*',
    font: 'dev/font/**/*',
    data: 'dev/data/**/*',
    cssDir: 'dev/style',
    browserifyFile: 'dev/script/app.es6',
    configFile: './dev/data/config.json'
};

var tmpPath = {
    html: '.tmp/*.html',
    css: '.tmp/style/**/*.css',
    js: '.tmp/script/**/*.js',
    htmlDir: '.tmp',
    cssDir: '.tmp/style',
    jsDir: '.tmp/script',
    jsTargetName: 'app.js'
};

var destPath = {
    root: 'dist/',
    htmlDir: 'dist/',
    cssDir: 'dist/style',
    jsDir: 'dist/script',
    imgDir: 'dist/image'
};

var util = {
    cleanSource: ['.tmp', 'dist', 'archive.zip'],
    copySource: [
        'dev/**/*',
        '!dev/*.html',
        '!dev/style/**/*',
        '!dev/script/**/*',
        '!dev/image/**/*',
        '!dev/template/**/*',
        '!dev/data/**/*',
    ],
    zipFile: 'archive.zip',
    compressFile: 'dist/**',
    compressDir: './',
    browserSyncDir: ['.tmp', 'dev'],
    devReloadSource: [
        devPath.img,
        devPath.font
    ]
};

var b = watchify(browserify({
    entries: [devPath.browserifyFile],
    debug: true
}));
b.on('update', bundleJs);


function getJsonData() {
    var jsonData = require(devPath.configFile);
    delete require.cache[require.resolve(devPath.configFile)];
    return jsonData;
};

gulp.task('swig', function() {
    return gulp.src(devPath.html)
    .pipe(data(getJsonData))
    .pipe(swig({defaults: { cache: false }}))
    .pipe(gulp.dest(tmpPath.htmlDir))
    .pipe(reload({stream: true}));
});

gulp.task('sass', function(){
    return gulp.src(devPath.sass)
    .pipe(compass({
        sassDir: devPath.cssDir,
        cssDir: tmpPath.cssDir
    }))
    .pipe(reload({stream: true}));
});

gulp.task('browserify-es6', bundleJs);

function bundleJs(){
    return b.bundle()
    .pipe(source(tmpPath.jsTargetName))
    .pipe(buffer())// convert from streaming to buffered vinyl file object
    // .pipe(babel({
    //     presets: ['es2015']
    // }))
    .pipe(gulp.dest(tmpPath.jsDir))
    .pipe(reload({stream: true}));
}

gulp.task('inject', function () {
    var cssSource = gulp.src(tmpPath.css).pipe(minifyCss());
    var jsSource = gulp.src(tmpPath.js).pipe(uglify());

    return gulp.src(tmpPath.html)
    .pipe(inject(cssSource, {
        transform: function (filePath, file) {
          return '<style>' + file.contents.toString('utf8') + '</style>';
        }
    }))
    .pipe(inject(jsSource, {
        transform: function (filePath, file) {
          return '<script>' + file.contents.toString('utf8') + '</script>';
        }
    }))
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
    }))
    .pipe(gulp.dest(destPath.htmlDir));
});

gulp.task('img', function(){
    return gulp.src(devPath.img)
    .pipe(imagemin())
    .pipe(gulp.dest(destPath.imgDir));
});

gulp.task('clean', function(){
    return gulp.src(util.cleanSource)
    .pipe(clean());
});

gulp.task('copy', function(){
    return gulp.src(util.copySource)
    .pipe(copy(destPath.root, {
        prefix: 1
    }));
});

gulp.task('compress', function(){
    return gulp.src(util.compressFile)
    .pipe(zip(util.zipFile))
    .pipe(gulp.dest(util.compressDir));
});

gulp.task('compile', function(cb){
    sequence('clean', ['swig', 'sass', 'browserify-es6'], cb);
});

gulp.task('default', ['compile'], function(){
    browserSync.init({
        port: 9000,
        server: {
            baseDir: util.browserSyncDir
        }
    });

    gulp.watch([devPath.html, devPath.configFile], ['swig']);
    gulp.watch(devPath.sass, ['sass']);
    // gulp.watch(devPath.js, ['browserify-es6']);

    gulp.watch(util.devReloadSource).on('change', reload);
});

gulp.task('build', function(cb){
    sequence('compile', ['inject', 'img'], 'copy', 'compress', cb);
});
