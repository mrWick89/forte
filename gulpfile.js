var gulp = require('gulp');
// CSS
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');   //подключение postcss
//var smartImport = require('postcss-smart-import'); //продвинутый импорт css в один файл https://github.com/sebastian-software/postcss-smart-import
//var nested = require('postcss-nested'); //позволяет делать вложенности как в cинтаксисе less
var autoprefixer = require('autoprefixer'); //автоматическое добавление префиксов свойствам
var cssnano = require('cssnano'); // продвинутая минификация css
//var simpleVars = require('postcss-simple-vars');//использование переменных в css
//var mixins = require('postcss-mixins');//использование примесей

// HTML & JS
var rigger = require('gulp-rigger'); // импорт в файл
var uglify = require('gulp-uglify'); // минификация js
// IMAGE
var imagemin = require('gulp-imagemin'); // минификация изображений
// webserver
var browserSync = require('browser-sync');
var reload = browserSync.reload;


var path = {
  src: {
    html: 'source/*.html',
    js: 'source/js/*.*',
    jslib: 'source/js/library/*.*',
    csslib: 'source/css/lib/*.*',
    style: 'source/css/*.*',
    img: 'source/image/*.*',
    fonts: 'source/fonts/*.*'
  },
  build: {
    html: 'build/',
    js: 'build/js/',
    jslib: 'build/js/',
    csslib: 'build/css/',
    style: 'build/css/',
    img: 'build/image/',
    fonts: 'build/fonts/'
  },

  watch: {
    html: 'source/**/*.html',
    js: 'source/js/**/*.js',
    style: 'source/css/**/*.scss',
    img: 'source/image/**/*.*',
    fonts: 'source/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "build/"
  },
  tunnel: true,
  host: 'loftshcool',
  port: 9000,
  logPrefix: "Frontend_Devil"
};






//                                              CSS
gulp.task('sass', function() {
  gulp.src(path.src.style)
    .pipe(sass())
    .pipe(postcss([
        autoprefixer({
          browsers: ['last 10 version']
        }),
        cssnano(),
    ]))
    .pipe(gulp.dest(path.build.style))
   .pipe(reload({stream: true}));
});

gulp.task('csslib', function() {
  gulp.src(path.src.csslib)
    .pipe(gulp.dest(path.build.csslib))
    .pipe(reload({stream: true}));
});

//                                            HTML
gulp.task('html', function() {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});
//                                            JavaScript
gulp.task('js', function() {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('jslib', function() {
  gulp.src(path.src.jslib)
    .pipe(uglify())
    .pipe(gulp.dest(path.build.jslib))
    .pipe(reload({stream: true}));
});
//                                            Image
gulp.task('image', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(path.build.img))
  .pipe(reload({stream: true}));
});

//                                            Fonts
gulp.task('fonts', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
  .pipe(reload({stream: true}));
});

gulp.task('build', ['html', 'js', 'jslib', 'csslib', 'sass', 'fonts', 'image']);


gulp.task('webserver', function() {
  browserSync(config);
});

//                                             Watcher
gulp.task('watch', function() {
  gulp.watch([path.watch.html], ['html']);
  gulp.watch([path.watch.style], ['sass']);
  gulp.watch([path.watch.js], ['js', 'jslib']);
  gulp.watch([path.watch.img], ['image']);
  gulp.watch([path.watch.fonts], ['fonts']);
});
//

gulp.task('default', ['build', 'webserver', 'watch']);
