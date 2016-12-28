var express = require('express');
var router = express.Router();
var passport = require('passport');
//var acl = require('../config/acl');
var TempUser = require('../model/user').tempUser;
var User = require('../model/user').user;
router.get('/', function(req, res){
    res.render('signup', {user:req.user});
});


//Local signup
router.post('/', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));



//Local signup email verification
router.get('/validate', function(req, res){
    var token = req.query.token;
    var medium = req.query.medium;
    console.log(token, medium);
    //todo: lookup token in tempUser
    var tempUser = new TempUser();
    TempUser.findOne({token:token}, function(err, user){
        if(err) return done(err);
        if(user) {
            //found the temp user
            var newUser = new User();
            newUser.local.email = user.email;
            newUser.local.password = user.password;
            newUser.save(function(err){
                if(err) {
                    console.log('Error while creating new user from tempUser!');
                    req.flash('err', 'cannot create user!');
                    res.redirect('/');
                }
                req.flash('success', 'Your account has been activated!');
                res.redirect('../profile');
            })

        }
    });

});

//Facebook signup
router.get('/auth/facebook', passport.authenticate('facebook-login', {
    scope: ['email']
}));


//Facebook Authenticate
router.get('/auth/facebook/callback', passport.authenticate('facebook-login', {
    successRedirect: '/',
    failureRedirect: '/'
}));


module.exports = router;