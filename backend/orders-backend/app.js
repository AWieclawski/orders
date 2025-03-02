const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cnf = require('./config/appConfig');

// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const customersRouter = require('./routes/customers');

const app = express();

// var indexRouter = require('./routes/index');
const orders = require('./routes/orders');
const ordersRouter = orders.router;
const positions = require('./routes/positions');
const positionsRouter = positions.router;

// https://thecodebuzz.com/access-to-xmlhttprequest-at-from-origin-has-been-blocked-by-cors-policy/
const cors = require('cors');
// Enable CORS for specific origins
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || cnf.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/positions', positionsRouter);
app.use('/customers', customersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
