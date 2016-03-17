/**
 * Created by s955281 on 3/15/16.
 */
var mongoose = require('mongoose');
var Schema = new mongoose.Schema;

mongoose.connect('http://localhost/vedadb');

module.exports = mongoose;