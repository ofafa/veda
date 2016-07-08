var express = require('express');
var router = express.Router();
var Medicine = require('../model/medicine');
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});


router.get('/search', function(req, res){
    console.log(req.query.keyword);
    Medicine.find({name:new RegExp(req.query.keyword, 'i')}, function(err, medicines){
        if(err){
            console.log('no such medicine');
            return req.redirect('/');
        }
        res.render('search', {user: req.user, medicines: medicines})
    });
});

router.get('/login', function(req, res){
    res.render('login', {user:req.user});
});

router.get('/signup', function(req, res){
    res.render('signup', {user:req.user});
});

router.get('/profile', isLoggedIn, function(req, res){
    res.render('profile', { user: req.user });
});

//Local login
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

//Local signup
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//Facebook login
router.get('/auth/facebook', passport.authenticate('facebook-login', {
    scope: ['email']
}));


//Facebook Authenticate
router.get('/auth/facebook/callback', passport.authenticate('facebook-login', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));


//Logout
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;
