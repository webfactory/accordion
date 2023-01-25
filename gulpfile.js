const gulp = require('gulp');
const config = require('./gulp-config');
const $ = require('./node_modules/webfactory-gulp-preset/plugins')(config); // loads all gulp-* modules in $.* for easy reference

const { webpack } = require('./node_modules/webfactory-gulp-preset/tasks/webpack');

function js(cb) {
    webpack(gulp, $, config);
    cb();
}

exports.js = js;
exports.default = gulp.series(js);
