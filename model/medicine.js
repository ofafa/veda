/**
 * Created by s955281 on 3/17/16.
 */
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/veda');
var Schema = mongoose.Schema;
var medSchema = new Schema({
    name: String,
    price: Number,
    position: String,
    row: Number,
    col: Number,
    index: String,
    info: String,
    created_at:Date,
    updated_at:Date

});


var Medicine = mongoose.model('Medicine', medSchema);
module.exports = Medicine;