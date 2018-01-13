'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cryptoSchema = mongoose.Schema({

    moneta 			: String,
    quantita		: String,
    investimento    : String,
    userId    : String,
    img: String
});


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds235877.mlab.com:35877/cryptodb');

module.exports = mongoose.model('cryptos', cryptoSchema);




