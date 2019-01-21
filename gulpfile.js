  var path = {
      app: {
            html: 'app/*.html',
            sass: 'app/sass/**/*.sass',
            img: 'app/img/**/*.*',
            fonts: 'app/fonts/**/*.*'
      },
      watch: {
              js: 'app/js/',
              css: 'app/css/'
      },
      dist: {
              html: 'dist/',
              js: 'dist/js/',
              css: 'dist/css/',
              img: 'dist/img/',
              fonts: 'dist/fonts/',
              all: 'dist/**'
      },
      };
  var gulp            = require('gulp'),
      gutil           = require('gulp-util' ),
      sass            = require('gulp-sass'),
      browserSync     = require('browser-sync'),
      concat          = require('gulp-concat'),
      uglify          = require('gulp-uglify'),
      cleancss        = require('gulp-clean-css'),
      rename          = require('gulp-rename'),
      autoprefixer    = require('gulp-autoprefixer'),
      notify          = require('gulp-notify'),
      rsync           = require('gulp-rsync'),
      imagemin        = require('gulp-imagemin'),
      jpegrecompress  = require('imagemin-jpeg-recompress'),
      pngquant        = require('imagemin-pngquant'),
      cache           = require('gulp-cache'),
      del             = require('del'),
      htmlmin         = require('gulp-htmlmin');
      libs_array      = [//Скрипты подключаемых библиотек
        'app/libs/jquery/dist/jquery.min.js',
        'app/js/common.js', // В последнюю очередь
      ]
  //watch таски для слежением за измененением файлов и обновления страницы браузера
  //Запуск локального сервера
  gulp.task('browser-sync', function() {
    browserSync({
      server: {
        baseDir: 'app'
      },
      notify: false,
      // open: false,
      // online: false,
      // tunnel: true, tunnel: "projectname",
    })
  });
  //Мониторинг ищменений в html и перезагрузка браузера при их внесении
  gulp.task('html:watch', function(done) {
    gulp.src(path.app.html)
    .pipe(browserSync.reload({ stream: true }));
    done();
  });
  //Сборка и минификация CSS из SASS, перезагрузка браузера при изменении стилей
  gulp.task('styles:watch', function(done) {
    gulp.src(path.app.sass)
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest(path.watch.css))
    .pipe(browserSync.reload({ stream: true }));
    done();
  });
  //Сборка JS, перезагрузка браузера при изменении скриптов
  gulp.task('scripts:watch', function(done) {
    gulp.src(libs_array)
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(path.watch.js))
    .pipe(browserSync.reload({ stream: true }));
    done();
  });
  gulp.task('watch', function() {
    gulp.watch(path.app.html, gulp.parallel('html:watch'));
    gulp.watch(path.app.sass, gulp.parallel('styles:watch'));
    gulp.watch(libs_array, gulp.parallel('scripts:watch'));
  });
  gulp.task('default', gulp.parallel('styles:watch', 'scripts:watch', 'html:watch', 'browser-sync', 'watch'));

  //dist таски для подготовки к деплою, все что можно сжимается и оптимизируется
  //Минификация html в папку dist
  gulp.task('html:dist', function(done) {
    gulp.src(path.app.html)
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      removeComments: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(gulp.dest(path.dist.html))
    done();
  });
  //Сборка и минификация CSS из SASS, копирование файла в папку dist
  gulp.task('styles:dist', function(done) {
    gulp.src(path.app.sass)
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest(path.dist.css))
    done();
  });
  //Сборка и минификация JS, копирование файла в папку dist
  gulp.task('scripts:dist', function(done) {
    gulp.src(libs_array)
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
    done();
  });
  //Перенос шрифтов в dist
  gulp.task('fonts:dist', function(done) {
    gulp.src(path.app.fonts)
    .pipe(gulp.dest(path.dist.fonts));
    done();
  })
  //Сжатие и перенос изображений в dist
  gulp.task('img:dist', function(done) {
    gulp.src(path.app.img)
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      jpegrecompress({
        progressive: true,
        max: 80,
        min: 70
      }),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: true}
        ]
      }),
      pngquant({
        quality: [0.7,0.9],
        speed: 1,
        floyd: 1
      })
    ])))
    .pipe(gulp.dest(path.dist.img));
    done();
  });
  //Удаление папки dist
  gulp.task('removedist', function (done) {
    del.sync('dist');
    done();
  });
  //Очистка кэша imagemin
  gulp.task('clearcache', function (done) {
    cache.clearAll();
    done();
  });
  //Перенос дополнительных файлов в корень dist если требуется
  gulp.task('other:dist', function(done) {
    gulp.src([
      'app/.htaccess',
      'app/robots.txt',
    ])
    .pipe(gulp.dest(path.dist.html));
    done();
  })
  //Сборка минифицированных файлов в dist
  gulp.task('build', gulp.parallel('removedist', 'clearcache', 'html:dist', 'styles:dist', 'scripts:dist', 'img:dist', 'fonts:dist', 'other:dist'));

  //Деплой проекта на сервер
  gulp.task('rsync', function(done) {
    gulp.src(path.dist.all)
    .pipe(rsync({
      root: 'dist/',
      hostname: 'username@yousite.com',
      destination: 'yousite/public_html/',
      include: ['*.htaccess', 'robots.txt'], // Включая эти файлы
      exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Исключая эти файлы
      recursive: true,
      archive: true,
      silent: false,
      compress: true
    }));
    done();
  });