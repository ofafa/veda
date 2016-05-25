/**
 * Created by s955281 on 3/15/16.
 */
var config = require('../config/config');
var mongoose = require('mongoose');
console.log(config.production.mongodb);
mongoose.connect(config.production.mongodb);
console.log('connected!')
module.exports = mongoose;