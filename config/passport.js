/**
 * Created by s955281 on 5/31/16.
 */
//load necessary stuff
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../model/user').user;
var TempUser = require('../model/user').tempUser;

//var Mailer = require('../config/mailer');
var sendgrid = require('../routes/sendgrid');

module.exports = function(passport){
    //serialize user for the session
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    //deserialize the user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    //local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passportField: 'password',
        passReqToCallback: true //pass the entire req to the callback
    }, function(req, email, password, done){
        //async
        process.nextTick(function(){
            User.findOne({'local.email': email}, function(err, user){
                if(err)
                    return done(err);
                if(user){
                    console.log('The email is already taken!');
                    return done(null, false, req.flash('signupMessage', 'This email is already taken.'))
                } else {
                    //create a tempUser if not occupied
                    var newTempUser = new TempUser();
                    newTempUser.email = email;
                    newTempUser.password = newTempUser.generateHash(password);
                    newTempUser.generateToken(function(token){
                        newTempUser.token = token;
                        newTempUser.save(function(err){
                            if(err){
                                throw err;
                            }
                            sendgrid(newTempUser.email, newTempUser.token, function(callback){
                                console.log(callback);
                            });
                            req.flash('Verification email sent to your inbox');
                            return done(null, newTempUser);
                        });

                    });

                }

            });
        });
    }));

    //local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
        console.log('user login');
        User.findOne({'local.email': email}, function(err, user){
            if (err) {return done(err);}
            if(!user){
                return done(null, false, req.flash('User does not exist'));
            }
            if(!user.validPassword(password)){
                return done(null, false, {message:'Wrong password!'});
            }
            return done(null, user);
        });
    }));

    //facebook login
    passport.use('facebook-login', new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: process.env.FB_CALLBACK_URL,
        profileFields: ['id','emails', 'name', 'displayName']
    }, function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'facebook.id': profile.id}, function(err, user){

                //if error
                if(err) return done(err);
                //if user found, log them in
                if(user){
                    //console.log(profile);
                    return done(null, user);
                } else {
                    var newUser = new User();
                    //console.log(profile);
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token  = token;
                    newUser.facebook.name = profile.displayName;
                    newUser.facebook.email = profile.emails[0].value;
                    //save user to db
                    newUser.save(function(err){
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            })
        });
    }));

};

