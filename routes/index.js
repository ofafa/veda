var express = require('express');
var router = express.Router();
var Medicine = require('../model/medicine');
var passport = require('passport');
var acl = require('../config/acl');

//Update price as prices that contains price over time data
function medicineSchemaUpgrade(){
    console.log('upgrade db schema');
    Medicine.find({price : {$exists: true} }, function(err, medicines){
        if(err) console.log('cannot find target medicine');
        medicines.forEach(function(medicine){
            console.log('upgrade:' + medicine.name);
            medicine.prices = [{price: 0, timestamp: Date.now()}];
            medicine.set('price', undefined, {strict: false});
            medicine.save();
        });
    });
}

//Add unit to prices
function medicineSchemaUpgradeV2(){
    console.log('upgrade db schema');
    Medicine.find({prices : {$exists: true} }, function(err, medicines){
        if(err) console.log('cannot find target medicine');
        medicines.forEach(function(medicine){
            console.log('upgrade:' + medicine.name);
            medicine.prices = [{price: medicine.price, unit: 'catty', timestamp: Date.now()}];
            medicine.save();
        });
    });
}


function medicineSchemaUpgrade(){
    console.log('upgrade db schema');
    Medicine.find({price: {$exists: true} }, function(err, medicines){
        if(err) console.log('cannot find target medicine');
        medicines.forEach(function(medicine){
            console.log('upgrade:' + medicine.name);
            medicine.prices = [{price: 0, timestamp: Date.now()}];
            medicine.set('price', undefined, {strict: false});
            medicine.save();
        });
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    //medicine schema upgrade
    medicineSchemaUpgrade();
    res.render('index', { user: req.user });
});


router.get('/search', acl.checkPermission('medicine', 'view'), function(req, res){
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
