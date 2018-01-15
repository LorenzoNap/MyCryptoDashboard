'use strict';

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


mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://root:root@ds235877.mlab.com:35877/cryptodb',  { useMongoClient: true });


module.exports = mongoose.model('coins', coinSchema);




