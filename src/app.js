var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const { connectDB } = require("./config/db");
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session')
var flash = require('connect-flash');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// admin 
const adminRouter = require('./routes/admin');

var app = express();

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
})) 
app.use(flash());


// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/sb-admin-2', express.static(path.join(__dirname, '../node_modules/startbootstrap-sb-admin-2')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


connectDB().then(() => {
  console.log("Established MongoDB Connection!");

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

module.exports = app;
