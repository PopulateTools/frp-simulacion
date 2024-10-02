const { src, dest, series, parallel, watch } = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const selector = require('postcss-custom-selectors');
const customProperties = require('postcss-custom-properties');
const nested = require('postcss-nested');
const reporter = require('postcss-reporter');
const imagemin = require('gulp-imagemin');
const nano = require('gulp-cssnano');
const notify = require('gulp-notify');
const browsersync = require('browser-sync');
const terser = require('gulp-terser');
const babel = require('gulp-babel');
const processhtml = require('gulp-processhtml');

const paths = {
    js: 'src/js',
    css: 'src/css',
    images: 'src/img/*',
    csv: 'src/csv',
    html: 'src',
    buildCss: 'dist/css/',
    buildJs: 'dist/js/',
    buildImages: 'dist/img/',
    buildCsv: 'dist/csv/'
};

const watchpaths = {
    js: [paths.js + '/**/*.js'],
    css: [paths.css + '/**/*.css'],
    minifycss: [paths.buildCss + '/**/*.css'],
    images: [paths.images + '/**/*.*'],
    csv: [paths.csv + '/**/*.*'],
    html: [paths.html + '/**/*.html'],
};

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './src',
            reloadDelay: 200
        },
        open: 'local',
        online: true
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function babelJS() {
    return src(watchpaths.js)
        .pipe(
            babel({
                presets: ['@babel/preset-env']
            })
        )
        .on('error', errorAlertJS)
        .pipe(dest(paths.buildJs))
        .pipe(
            notify({
                message: 'JavaScript complete'
            })
        );
}

function errorAlertJS(error) {
    notify.onError({
        title: 'JavaScript',
        subtitle: 'Something is wrong in your JavaScript file',
        sound: 'Basso'
    })(error);
    console.log(error.toString());
    this.emit('end');
}

function errorAlertPost(error) {
    notify.onError({
        title: 'postCSS',
        subtitle: 'Something is wrong in your CSS file',
        sound: 'Basso'
    })(error);
    console.log(error.toString());
    this.emit('end');
}

function css() {
    const processors = [
        reporter({
            clearMessages: true
        }),
        nested,
        customProperties,
        selector,
        autoprefixer
    ];
    return src('./src/css/styles.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .on('error', errorAlertPost)
        .pipe(
            sourcemaps.write('./', {
                sourceRoot: '/src'
            })
        )
        .pipe(dest(paths.buildCss))
        .pipe(
            notify({
                message: 'postCSS completed'
            })
        );
}

function minify() {
    return src(watchpaths.minifycss)
        .pipe(nano())
        .pipe(dest(paths.buildCss))
        .pipe(
            notify({
                message: '[CSS] Minify completed'
            })
        );
}

function images() {
    return src(paths.images)
        .pipe(imagemin())
        .pipe(dest(paths.buildImages));
}

function compress() {
    return src(watchpaths.js)
        .pipe(terser())
        .on('error', errorAlertJS)
        .pipe(dest(paths.buildJs))
        .pipe(
            notify({
                message: '[JavaScript] Minify completed'
            })
        );
}

function html() {
    return src(watchpaths.html)
        .pipe(processhtml())
        .pipe(dest('dist'))
        .pipe(
            notify({
                message: '[HTML] Build in dist folder'
            })
        );
}

function csv() {
    return src(watchpaths.csv)
        .pipe(dest(paths.buildCsv))
        .pipe(
            notify({
                message: '[CSV] Moved to dist folder'
            })
        );
}

function watchFiles() {
  watch(watchpaths.css, { interval: 300 }, series(css, browserSyncReload));
  watch(paths.images, { interval: 300 }, series(images, browserSyncReload));
  watch(watchpaths.js, { interval: 300 }, series(babelJS, browserSyncReload));
  watch(watchpaths.html, { interval: 300 }, series(html, browserSyncReload));
  watch(watchpaths.csv, browserSyncReload);
}

const build = series(css, images, minify, compress, html, csv);

const watching = parallel(watchFiles, browserSync);

module.exports = {
    watchFiles,
    browserSync,
    babelJS,
    browserSyncReload,
    css,
    minify,
    images,
    compress,
    watching,
    build
};
