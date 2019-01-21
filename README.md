# DSERV — start HTML template
![DSERV](https://github.com/akaybagorov/DSERV-start-HTML-template/raw/master/app/img/banner.jpg)
DSERV — стартовый HTML шаблон для небольших проектов
===
За основу шаблона взят [OptimizedHTML-4](https://github.com/agragregra/OptimizedHTML-4) от [WebDesign Master](https://webdesign-master.ru/). Была переделана логика тасков, добавлены новые таски, для удобства добавлены новые переменные. 
***
## Используемые инструменты:
* Gulp 4
* Bootstrap 4
* Fontawesome 5
***
## Структура файлов выглядит следующим образом:
+ app
  + fonts
  + img
  + js
  + libs
  + sass
  + *.html
+ watch
  + css
  + fonts
  + img
  + js
  + *.html
+ dist
  + css
  + fonts
  + img
  + js
  + *.html
+ gulpfile.js
+ package.json
***

В папке 'app' находятся все исходники проекта, в том числе библиотеки, шрифты и изображения. 

В папку 'watch' в процессе разработки компилируются и копируются неоптимизированные файлы и изображения. 

В папку 'dist' сохраняются все сжатые и оптимизированные файлы, готовые к деплою на сервер.
***
