# DSERV — start HTML template
![DSERV](https://github.com/akaybagorov/DSERV-start-HTML-template/raw/master/app/img/banner.jpg)
DSERV — стартовый HTML шаблон для frontend разработчиков.
===
За основу шаблона взят [OptimizedHTML-4](https://github.com/agragregra/OptimizedHTML-4) от [WebDesign Master](https://webdesign-master.ru/). Была переделана логика тасков, добавлены новые таски, для удобства добавлены новые переменные.

DSERV по-умолчанию использует следующие инструменты Gulp 4, Bootstrap 4 (reboot + grid), Fontawesome 5, Sass, Browsersync, Autoprefixer, Clean-CSS, Uglify, Imagemin, Rsync.

Кросс-браузерная совместимость: IE9+.

## Быстрый старт
1. [Скачайте](https://github.com/akaybagorov/DSERV-start-HTML-template/archive/master.zip) архив проекта c Github
2. Установите модули командой `npm i`
3. Запустите шаблон командой `gulp`

### Базовые таски
+ `gulp` — таск для веб-разработки (sass, js, browsersync, watch)
+ `gulp build` — сборка и минификация html+css+js и оптимизация изображений (jpeg, png, svg) в папку 'dist'
+ `gulp rsync` — деплой проекта на сервер используя **rsync**

## Настройки
Для добавления новой билиотеки подключите ее файлы стилей в файле *'app/sass/_libs.sass'*, а скрипты в файле *'gulpfile.js'* в переменную `libs_array`.
