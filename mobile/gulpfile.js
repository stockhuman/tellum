/*
	Michael Hemingway (c) 2017
	==
	run the whole shabang with `$ gulp watch` in the project directory
	install them all with
	$ npm i -D gulp gulp-sass gulp-concat gulp-rename gulp-babel gulp-babel-minify babel-preset-env browser-sync 
*/

const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const minify = require("gulp-babel-minify")
const browserSync = require('browser-sync').create()

// environment variables
const project = 'public' // replace with your localhost folder
const path = '' // relative path to be in the required project
const assets = '/assets' // img, css, js, pdf ...
// const minijs = true // minify javascript
const minicss = true // minify css
const scss = true // compile style.css from scss folder in build tools
// const js = true // compile app.js from folder in build tools


// compiles scss files to css
gulp.task('sass', function () {
	if (scss) {
		return gulp.src('scss/**/*.scss')
		.pipe(
			sass({ outputStyle: (minicss) ? 'compressed' : 'compact'}).on('error', function (err) {
				console.error(err.message)
				// Display error in the browser
				browserSync.notify(err.message, 3000)
				// Prevent gulp from catching the error and exiting the watch process
				this.emit('end')
			}))
		.pipe(gulp.dest( path + project + assets + '/css/'))
		.pipe(browserSync.reload({ stream: true }))
	}
})

// compiles and concatenates js files and reloads the browser
gulp.task('scripts', function () {
	let scr = 'js/**/*.js'
	let dest = path + project + assets + '/js/'

	return gulp.src(scr)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(dest))
		.pipe(rename('app.min.js'))
		.pipe(minify({mangle: {keepClassName: true}}).on('error', err => {
				console.error(err.message)
				// Display error in the browser
				browserSync.notify(err.message, 3000)
				// Prevent gulp from catching the error and exiting the watch process
				this.emit('end')
			}))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.reload({ stream: true }))
})

// does browser live-reloading
gulp.task('browserSync', () => 
	browserSync.init({ 
		server: { baseDir:"./public" },
    https: true 
  })
)

// watches files for changes, adjust accordingly
gulp.task('watch', ['browserSync', 'sass', 'scripts'], function () {
	gulp.watch('scss/**/*.scss', ['sass'])
	gulp.watch('js/**/*.js', ['scripts'])
	// gulp.watch(path + project + assets + '/js/**/*.js', ['scripts'])
	gulp.watch(path + project + '**/*.html').on('change', browserSync.reload)  // pages
})

// stop old version of gulp watch from running when you modify the gulpfile
gulp.watch("gulpfile.js").on( "change", () => process.exit(0) )
