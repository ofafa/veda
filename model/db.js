/**
 * Created by s955281 on 3/15/16.
 */
var mongoose = require('mongoose');
var dbpath = 'http://localhost/vedadb';
mongoose.createConnection(dbpath);

module.exports = mongoose;