var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serveIndex = require('serve-index');
const upload = require(__dirname + '/routes/upload-module');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require(__dirname + '/routes/session-parser-module'));

app.post('/upload-single', upload.single('avatar'), (req, res)=>{
  res.json(req.file);
});

app.post('/upload-multiple', upload.array('myFiles'), (req, res)=>{
  const ar = [];
  req.files.forEach(f=>{
    ar.push(f.filename);
  });
  res.json(ar);
});

app.get('/try-sess', (req, res)=>{
  req.session.shin = req.session.shin || 0;
  req.session.shin++;

  res.json(req.session);
  //res.end(req.session.shin.toString());
});

app.get('/try-sse', (req, res)=>{
  let id = 20;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  setInterval(function(){
    id++;
    res.write('id: ' + id + '\n');
    res.write('data: ' + new Date().toLocaleString() + '\n\n');
  }, 2000);


});




app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);





app.use('/', serveIndex('public', {icons: true}));

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

module.exports = app;
