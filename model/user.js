/**
 * Created by s955281 on 5/9/16.
 */
var mongoose = require("./db");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    local:{
        email: String,
        password:String
    },

    facebook:{
        id:String,
        token:String,
        email:String,
        name:String
    },

    twitter:{
        id:String,
        token:String,
        displayName:String,
        username:String
    },

    profile: {
        name: String,
        phone: String,
        email: String,
        gender: Number,
        role: String,
        address: {zip: String, street: String, state: String, country: String},
        birthday: Date,
        recipe: {recipeName: String, timestamp: Date},
        note: String,
        created_at:Date,
        updated_at:Date
    }
}, {timestamps: true});

userSchema.methods.genereteHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);