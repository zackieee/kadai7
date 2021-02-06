const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const cashRouter = require('./routes/cache');

const app = express();

// etag不使用(static以外に有効)
// app.disable('etag');
app.set('etag', 'weak');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// キャッシュ確認用
app.use(express.static(path.join(__dirname, 'public/cache'), {
  maxAge: '10m' // キャッシュのfresh期間 10分
}));
// 非キャッシュ確認用
app.use(express.static(path.join(__dirname, 'public/maxage0'), {
  setHeaders: setCustomCacheControlMaxAge0
}));
// 非キャッシュ確認用
app.use(express.static(path.join(__dirname, 'public/nocache'), {
  setHeaders: setCustomCacheControlNoCache
}));
// 非キャッシュ確認用
app.use(express.static(path.join(__dirname, 'public/nostore'), {
  setHeaders: setCustomCacheControlNoStore
}));

app.use('/', indexRouter);
app.use('/cache', cashRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function setCustomCacheControlNoStore (res, path) {
    res.setHeader('Cache-Control', 'no-store')
}

function setCustomCacheControlNoCache (res, path) {
  res.setHeader('Cache-Control', 'no-cache')
}

function setCustomCacheControlMaxAge0 (res, path) {
  res.setHeader('Cache-Control', 'private, max-age=0')
}

module.exports = app;
