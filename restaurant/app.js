var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
const hbs = require("hbs");
var mongoose = require('mongoose');
const Day = require("./models/day").model; 
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
// Установим подключение по умолчанию
const mongoDB = 'mongodb://127.0.0.1/restaurant';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
   if (err) throw err;
  console.log('Successfully connected!');
});
// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;
// Получение подключения по умолчанию 
const db = mongoose.connection;
// Удаляем коллекцию, чтобы данные в бд очищались после запуска сервера(пока закомментируем, чтобы видеть процесс)
db.dropCollection('days', function(err, result) {});

// Привязать подключение к событию ошибки  (получать сообщения об ошибках подключения)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname + "/views/partials"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


let currentDate = new Date();
let currentMonth = currentDate.getMonth();
const availTime = [14, 18, 22];
const allTables = require("./data/allTables");
     
for (let x = 1; x <= 31; x++) {
  for (let y = 0; y < availTime.length; y++)
  {
    Day.create({date: new Date(2021, currentMonth, x, availTime[y], 0), tables: allTables}, function(err, doc){
    //mongoose.disconnect();
    if(err) 
      return console.log(err); 
      //console.log("Сохранен объект table: ", doc);
    });
  }
}

app.get("/", function(req, res) {
  res.render("home.hbs");
});

app.get("/reserve", function(req, res) {
  res.render("booking.hbs");
});

app.get("/about", function(req, res) {
  res.render("about.hbs");
});

app.get("/tables", function(req, res) {
  res.render("check.hbs");
});

app.use("/tables", require("./routes/availability"));
app.use("/reserve", require("./routes/reservation"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
