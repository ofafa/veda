//packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
let redisStore = require('connect-redis')(expressSession);
let url = require('url');
let redis = require('redis');
//passport

var passport = require("passport");
var flash = require("connect-flash");
require('./config/passport')(passport);

//typeahead
var typeahead = require('./config/typeaheadcfg')();

//routes
var routes = require('./routes/index');
var users = require('./routes/users');
var medicine = require('./routes/medicines');
var signup = require('./routes/signup');
var acl = require('./routes/acl');
const composition = require('./routes/compositions');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
let redis_client = '';

//session management
if(process.env.REDISTOGO_URL){
    let rtg = url.parse(process.env.REDISTOGO_URL);
    redis_client = redis.createClient(rtg.port, rtg.hostname);
    redis_client.auth(rtg.auth.split(':')[1]);
}
else{
    redis_client = redis.createClient('6379', 'localhost');
}

//required for passport
app.use(expressSession({
    store: new redisStore({client:redis_client}),
    secret:process.env.PASSPORT_SECRET,
    cookie: {
    maxAge: 72000000
  }}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




//set routes
app.use('/', routes);
app.use('/users', users);
app.use('/medicine', medicine);
app.use('/signup', signup);
app.use('/acl', acl);
app.use('/composition', composition);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

process.env._ROOTPATH = __dirname;


module.exports = app;
