import gulp from 'gulp';
import compass from  'gulp-for-compass' ;
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import htmlmin from 'gulp-htmlmin';
import minifyCss from 'gulp-minify-css';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import copy from 'gulp-copy';
import clean from 'gulp-clean';
import sequence from 'gulp-sequence';
import zip from 'gulp-zip';
import watchify from 'watchify';
import exit from 'gulp-exit';
import notify from 'gulp-notify';
import cache from 'gulp-cached';
import browserSync from 'browser-sync';
import glob from 'glob';
import path from 'path';

import vueify from 'vueify';
import aliasify from 'aliasify';


const reload = browserSync.reload;
const browserifyObjectArray = [];


const devFolder = 'dev';
const destFolder = 'dist';

const styleFolder = 'style';
const scriptFolder = 'script';
const imageFolder = 'image';
const componentFolder = 'component';

const archiveFile = 'archive.zip';


const devPath = {
    html: path.join(devFolder, '*.html'),
    sass: path.join(devFolder, styleFolder, '**', '*.{scss,sass}'),
    js: path.join(devFolder, scriptFolder, '*.js'),
    img: path.join(devFolder, imageFolder, '**', '*'),
    cssDir: path.join(devFolder, styleFolder),
};

const destPath = {
    root: path.join(destFolder),
    html: path.join(destFolder, '*.html'),
    css: path.join(destFolder, styleFolder, '**', '*.css'),
    js: path.join(destFolder, scriptFolder, '**', '*.js'),
    cssDir: path.join(destFolder, styleFolder),
    jsDir: path.join(destFolder, scriptFolder),
    imgDir: path.join(destFolder, imageFolder),
};

const util = {
    cleanSource: [destFolder, archiveFile],
    copySource: [
        path.join(devFolder, '**', '*'),
        '!' + path.join(devFolder, '*.html'),
        '!' + path.join(devFolder, styleFolder, '**', '*'),
        '!' + path.join(devFolder, scriptFolder, '**', '*'),
        '!' + path.join(devFolder, imageFolder, '**', '*'),
    ],
    archiveFile: archiveFile,
    compressFile:  path.join(destFolder, '**'),
    compressDir: '.' + path.sep,
    browserSyncDir: [destFolder, devFolder],
    devReloadSource: [
        path.join(devFolder, '**', '*'),
        '!' + path.join(devFolder, componentFolder, '**', '*'),
        '!' + path.join(devFolder, styleFolder, '**', '*'),
        '!' + path.join(devFolder, scriptFolder, '**', '*'),
    ],
};

glob(devPath.js, (err, files) => {
    files.forEach((file) => {
        let name = path.basename(file);

        let instance = browserify({
            entries: [file],
            cache: {},
            packageCache: {},
            fullPaths: true,
            plugin: [watchify],
        })
        .transform(vueify)
        .transform(babelify, {presets: ['es2015']})
        .transform(aliasify, {
            aliases: {
                vue: 'vue/dist/vue.js'
            },
            verbose: false
        });

        browserifyObjectArray.push({
            name: name,
            instance: instance,
            processor: () => {
                instance
                .bundle()
                .on('error', (err) => {
                    console.log(err.toString());
                    this.emit('end');
                })
                .pipe(source(name))
                .pipe(buffer())
                .pipe(gulp.dest(destPath.jsDir))
                .pipe(reload({stream: true}));
            }
        });
    });
});

function bundleJs(){
    browserifyObjectArray.forEach((obj) => {
        obj.processor();
    });
}

gulp.task('sass', () => {
    return gulp.src(devPath.sass)
    .pipe(cache('sass'))
    .pipe(compass({
        sassDir: devPath.cssDir,
        cssDir: destPath.cssDir
    }))
    .pipe(reload({stream: true}));
});

gulp.task('browserify', bundleJs);

gulp.task('minify-html', () => {
    return gulp.src(devPath.html)
    .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
    }))
    .pipe(gulp.dest(destPath.root));
});

gulp.task('minify-css', () => {
    return gulp.src(destPath.css)
    .pipe(minifyCss())
    .pipe(gulp.dest(destPath.cssDir));
});

gulp.task('minify-js', () => {
    return gulp.src(destPath.js)
    .pipe(uglify())
    .pipe(gulp.dest(destPath.jsDir));
});

gulp.task('img', () => {
    return gulp.src(devPath.img)
    .pipe(imagemin())
    .pipe(gulp.dest(destPath.imgDir));
});

gulp.task('clean', () => {
    return gulp.src(util.cleanSource)
    .pipe(clean());
});

gulp.task('copy', () => {
    return gulp.src(util.copySource)
    .pipe(copy(destPath.root, {
        prefix: 1
    }));
});

gulp.task('compress', () => {
    return gulp.src(util.compressFile)
    .pipe(zip(util.archiveFile))
    .pipe(gulp.dest(util.compressDir));
});

gulp.task('complete', () => {
    gulp.src('')
    .pipe(notify({
        message: 'build complete',
    }))
    .pipe(exit());
});

gulp.task('compile', (cb) => {
    sequence('clean', ['sass', 'browserify'], cb);
});

gulp.task('default', ['compile'], () => {
    browserSync.init({
        port: 9000,
        server: {
            baseDir: util.browserSyncDir,
        },
    });

    gulp.watch(devPath.sass, ['sass']);

    browserifyObjectArray.forEach((obj) => {
        obj.instance.on('update', obj.processor);
    });

    gulp.watch(util.devReloadSource).on('change', reload);
});

gulp.task('build', (cb) => {
    sequence('compile', ['minify-html', 'minify-css', 'minify-js', 'img'], 'copy', 'compress', 'complete', cb);
});
