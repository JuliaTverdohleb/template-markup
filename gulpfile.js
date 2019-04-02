'use strict'
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
// npm init
// npm install gulp-cli -g
// npm i --save-dev gulp gulp-sass gulp-sourcemaps gulp-concat gulp-autoprefixer del browser-sync gulp-notify gulp-plumber
var config = {
	path: {
		mainScss: './src/scss/main.scss',
		assets: './src/assets/**',
		html: './src/index.html',
		js: './src/js/**',
		mainJs: './src/index.js'
	},
	output: {
		cssName: 'bundle.min.css',
		path: './public'
	}
}

gulp.task('default', function (callback) {
	console.log('Success!');
	callback();
});

gulp.task('styles', function () {
	return gulp.src(config.path.mainScss)
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					message: "Error: <%= error.message %>",
					title: "Styles error"
				};
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat(config.output.cssName))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(config.output.path))
		.pipe(browserSync.stream());
});

gulp.task('clean', function () {
	return del(config.output.path);
});

gulp.task('assets', function () {
	return gulp.src([config.path.assets, config.path.html, config.path.js, config.path.mainJs], {
		base: 'src'
	}, {
			since: gulp.lastRun('assets')
		})
		.pipe(gulp.dest(config.output.path));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets')));

gulp.task('watch', function () {
	gulp.watch('src/scss/**/*.*', gulp.series('styles'));
	gulp.watch('src/assets/**/*.*', gulp.series('assets'));
	gulp.watch('src/index.html', gulp.series('assets'));
	gulp.watch('src/js/**/*.*', gulp.series('assets'));
	gulp.watch('src/index.js', gulp.series('assets'));
});

gulp.task('serve', function () {
	browserSync.init({
		server: 'public'
	});
	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));