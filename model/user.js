/**
 * Created by s955281 on 5/9/16.
 */
var mongoose = require("mongoose");

console.log('connect to database...')
//Remote db
mongoose.connect('mongodb://virtue:Meister@ds021711.mlab.com:21711/vedabase');
//localdb
//mongoose.connect('mongodb://localhost/veda');

console.log('connection built!')
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: String,
    password: String,
    phone: String,
    email: String,
    gender: Number,
    role: String,
    address: {zip: String, street: String, state: String, country: String},
    birthday: Date,
    recipe: {recipe: recipeSchema, timestamp: Date},
    note: String,
    created_at:Date,
    updated_at:Date

}, {timestamps: true});
var User = mongoose.model('User', userSchema);
