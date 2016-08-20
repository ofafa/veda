/**
 * Created by s955281 on 3/17/16.
 */
var mongoose = require('./db');
var Schema = mongoose.Schema;

var priceSchema = {price: Number, unit: String, timestamp: Date};
var medSchema = new Schema({
    name: String,
    prices: [priceSchema],
    position: String,
    row: Number,
    col: Number,
    index: String,
    info: String,
    created_at:Date,
    updated_at:Date

}, {timestamps: true});
var Medicine = mongoose.model('Medicine', medSchema);


module.exports = Medicine;