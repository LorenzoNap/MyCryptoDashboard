'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const profitSchema = mongoose.Schema({

    date 			: String,
    guadagno		: String
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds235877.mlab.com:35877/cryptodb');

module.exports = mongoose.model('profits', profitSchema);




