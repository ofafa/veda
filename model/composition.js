/**
 * Created by s955281 on 13/01/2017.
 */
var mongoose = require('./db');
var Schema = mongoose.Schema;

var ingredientSchema = {id:String, name: String, q: Number, unit: String};
var priceSchema = {price: Number, timestamp: Date};
var commentSchema = {name: String, content: String, rating: Number, date: Date};
var compositionSchema = new Schema({
    name: String,
    type: String,
    ingredients:[ingredientSchema],
    intro: String,
    limitation: [String],
    processing: String,
    keyword: [String],
    prices: [priceSchema],

    latest_price: priceSchema,
    comments:[commentSchema],
    created_at:Date,
    updated_at:Date

}, {timestamps: true});
var Composition = mongoose.model('composition', compositionSchema);


module.exports = Composition;