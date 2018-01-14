'use strict';


var Coins = require('../models/coin');


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coinSchema = mongoose.Schema({

    "Id" : String,
    "Url" : String,
    "ImageUrl" : String,
    "Name" : String,
    "Symbol" : String,
    "CoinName" : String,
    "FullName" : String,
    "Algorithm" : String,
    "ProofType" : String,
    "FullyPremined" : String,
    "TotalCoinSupply" :String,
    "PreMinedValue" : String,
    "TotalCoinsFreeFloat" :String,
    "SortOrder" : String,
    "Sponsored" : Boolean
});


const cryptoSchema = mongoose.Schema({

    moneta 			: coinSchema,
    quantita		: String,
    investimento    : String,
    userId    : String,
    img: String
});


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds235877.mlab.com:35877/cryptodb');

module.exports = mongoose.model('cryptos', cryptoSchema);




