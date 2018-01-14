var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var url = require('url');

var port = process.env.PORT || 5000

//connect to MongoDB
mongoose.connect('mongodb://root:root@ds235877.mlab.com:35877/cryptodb');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    // store: new MongoStore({
    //     mongooseConnection: db
    // })
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


// listen on port 3000
app.listen(port, function () {
    console.log('Express app listening on port 3000');
});


//
// 'use strict';
//
// const Crypto = require('./models/crypto');
// const Profit = require('./models/profit');
// const User = require('./models/user');
//
//
// var request = require('request');
// var dateFormat = require('dateformat');
// var session = require('express-session')
//
//
// const express = require('express'), bodyParser = require('body-parser');
// const path = require('path')
// const PORT = process.env.PORT || 5000
//
//
//
// function intervalFunc() {
//     console.log('Cant stop me now!');
//
//     var cryptosValuesMoney = {eur: 0, usd: 0, totale: 0};
//
//     Crypto.find({}, function (err, monete) {
//         if (err) return handleError(err);
//
//
//         var count = 0;
//
//         monete.forEach(function (value, index) {
//             var moneta = monete[index]
//
//
//             request("https://min-api.cryptocompare.com/data/price?fsym=" + moneta.moneta + "&tsyms=USD,EUR", function (error, response, body) {
//
//                 if (!error && response.statusCode == 200) {
//
//                     count ++;
//                     var resultMoneta = JSON.parse(response.body)
//
//                     cryptosValuesMoney.eur = cryptosValuesMoney.eur + parseFloat(Math.round(resultMoneta.EUR * moneta.quantita * 100) / 100);
//                     cryptosValuesMoney.usd = cryptosValuesMoney.usd + parseFloat(Math.round(resultMoneta.USD * moneta.quantita * 100) / 100);
//                     cryptosValuesMoney.totale = cryptosValuesMoney.totale + parseFloat(moneta.investimento);
//                     if(count == monete.length){
//
//                         var date = dateFormat(new Date, "dd-mm-yyyy");
//
//                         Profit.find({date:date }, function (err, profits) {
//                             if(profits.length <= 0){
//                                 var arvind = new Profit({
//                                     date : dateFormat(new Date, "dd-mm-yyyy"),
//                                     guadagno : cryptosValuesMoney.eur
//
//                                 });
//
//                                 arvind.save(function (err, data) {
//                                     if (err) console.log(err);
//                                     else console.log('Saved : ', data );
//                                 });
//                             }
//                         })
//
//
//                     }
//                 }
//
//             })
//
//
//         })
//
// })
// }
//
// setInterval(intervalFunc, 9500000);
//
//
//
// express()
//     .use(bodyParser.json())
//     .use(session({
//     secret: 'work hard',
//     resave: true,
//     saveUninitialized: false
// }))
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//
// .post('/', function (req, res, next) {
//     // confirm that user typed same password twice
//     if (req.body.password !== req.body.passwordConf) {
//         var err = new Error('Passwords do not match.');
//         err.status = 400;
//         res.send("passwords dont match");
//         return next(err);
//     }
//
//     if (req.body.email &&
//         req.body.username &&
//         req.body.password &&
//         req.body.passwordConf) {
//
//         var userData = {
//             email: req.body.email,
//             username: req.body.username,
//             password: req.body.password,
//             passwordConf: req.body.passwordConf,
//         }
//
//         User.create(userData, function (error, user) {
//             if (error) {
//                 return next(error);
//             } else {
//                 req.session.userId = user._id;
//                 return res.redirect('/profile');
//             }
//         });
//
//     } else if (req.body.logemail && req.body.logpassword) {
//         User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
//             if (error || !user) {
//                 var err = new Error('Wrong email or password.');
//                 err.status = 401;
//                 return next(err);
//             } else {
//                 req.session.userId = user._id;
//                 return res.redirect('/profile');
//             }
//         });
//     } else {
//         var err = new Error('All fields required.');
//         err.status = 400;
//         return next(err);
//     }
// })
//   .get('/profits', function (req, res) {
//     Profit.find({}, function (err, monete) {
//         if (err) return handleError(err);
//
//         res.json(monete);
//
//
//     })
//   })
//     .get('/users', function (req, res) {
//
//         if (req.param("email") &&
//             req.param("username") &&
//             req.param("password") &&
//             req.param("passwordConf")) {
//             var userData = {
//                 email: req.param("email"),
//                 username: req.param("username"),
//                 password: req.param("password"),
//                 passwordConf: req.param("passwordConf"),
//             }
//             //use schema.create to insert data into the db
//             User.create(userData, function (err, user) {
//                 if (err) {
//                     return next(err)
//                 } else {
//                     return res.redirect('/profile');
//                 }
//             });
//         }
//     })
//
//   .get('/cryptos', function (req, res) {
//
//
//       Crypto.find({}, function (err, profits) {
//         if (err) return handleError(err);
//
//         res.json(profits);
//
//
//     })
//
// })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
