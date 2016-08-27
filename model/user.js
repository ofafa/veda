/**
 * Created by s955281 on 5/9/16.
 */
var mongoose = require("./db");
var crypto = require("crypto");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;

var tempUserSchema = new Schema({
    email: String,
    password: String,
    token: String

});

var userSchema = new Schema({
    local:{
        email: String,
        password:String,
        verified: Boolean
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

//===Methods===

//Generate hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//check if password is valid
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};


tempUserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

tempUserSchema.methods.generateToken = function(callback){
    crypto.randomBytes(48, function(ex, buf){
        console.log('generating token...');
        return callback(buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-'));
        //console.log('token:' + token);
    })
};


/*
tempUserSchema.methods.create = function(email, password){
    console.log('creating temp user...');
    this.email = email;
    this.password = password;
    //this.token = this.generateToken();
    this.generateToken(function(token){
        console.log('token is ' + token);
        this.token = token;

    });


    return new Promise(function(resolve, reject){
        this.email = email;
        this.password = this.generateHash(password);
        this.token = this.generateToken(function(err){
            if(err) {
                console.log(err);
                return reject(err);
            }

        });
        console.log('token is ' + this.token);
        resolve(this);
    });
});
    */


module.exports = {
    user: mongoose.model('User', userSchema),
    tempUser: mongoose.model('TempUser', tempUserSchema)
};