var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require("path");
var request = require('request');
var url = require('url');


var Crypto = require('../models/crypto');
var Coins = require('../models/coin');

// GET route for reading data
router.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/dashboard');
            }
        });

    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/dashboard');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

// GET route after registering
router.get('/dashboard', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    // var err = new Error('Not authorized! Go back!');
                    // err.status = 400;
                    // return next(err);

                    return res.sendFile(path.join(__dirname.replace("routes", "") + '/templateLogReg/index.html'))

                } else {
                    return res.sendFile(path.join(__dirname.replace("routes", "") + '/templateLogReg/indexAdminLTE.html'));
                    // return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.get('/coinList', function (req, res) {
    // +req.url.split("name=")[1]+
    var re = new RegExp(".*"+req.url.split("name=")[1]+"*/i");

    var expression_one = "/.*" + req.url.split("name=")[1]+".*/i";
    var expression_two = req.url.split("name=")[1];
    var expression_three = new RegExp(expression_one);

    var searchPhrase = "MT";
    var regularExpression = new RegExp(".*" + req.url.split("name=")[1] + ".*", "i");

    Coins.find({ $or:[ {"Symbol":  { $regex : regularExpression } }, {"CoinName":{ $regex :regularExpression }} ]}, function (err, coins){
        if (err) return handleError(err);
        res.send(coins)
    })
})

router.get('/myCoinTable', function (req, res) {


    Crypto.find({userId: req.session.userId}, function (err, cryptos) {

        if (err) return handleError(err);
        var counter = 0;
        var returnJson = []
        cryptos.forEach(function (crypto, value) {

            request("https://min-api.cryptocompare.com/data/price?fsym=" + crypto.moneta + "&tsyms=USD,EUR", function (error, response, body) {

                counter++;

                var response = JSON.parse(response.body);

                var json = crypto.toJSON();
                json.valoreEur = parseFloat(Math.round(response.EUR * crypto.quantita * 100) / 100).toFixed(2)
                json.valoreUsd = parseFloat(Math.round(response.USD * crypto.quantita * 100) / 100).toFixed(2)

                returnJson.push(json)

                if(counter == cryptos.length){
                    res.json(returnJson)
                }
            })

        })


    })



})



router.post('/saveMyCrypto', function (req, res) {

    if (req.body) {

        //svuota prima tutte le monete

        Crypto.remove({}, function (err) {
            if (err) return handleError(err);
            req.body.forEach(function (value, index) {
                var crypto = {
                    moneta: req.body[index].moneta,
                    quantita: req.body[index].quantita,
                    investimento: req.body[index].investimento,
                    userId: req.session.userId,
                }

                Crypto.create(crypto, function (error, user) {
                    if (error) {
                        return next(error);
                    } else {
                        // req.session.userId = user._id;
                        // return res.redirect('/dashboard');
                    }
                });
            })
        });

        return res.redirect('/dashboard');


    }

})

router.get('/myUser', function (req, res) {

    User.findById(req.session.userId, function (err, user) {

        if (err) return handleError(err);
        res.json(user)

    })

})



router.get('/cryptos', function (req, res) {


    Crypto.find({userId: req.session.userId}, function (err, cryptos) {

        if (err) return handleError(err);

        res.json(cryptos)


    })

})

module.exports = router;