var express = require('express');
var router = express.Router();
var Medicine = require('../model/medicine');
var passport = require('passport');
var acl = require('../config/acl');

/*
function medicineSchemaUpgradev3(){
    "use strict";
    console.log('add latest price');
    Medicine.find({prices:{$exists:true}}, (err, medicines) => {
        if(err) console.log(err);

        medicines.forEach(medicine => {
            console.log('update:' + medicine.name);
            let ancient = Number.NEGATIVE_INFINITY;
            let latest_price = [];
            medicine.prices.forEach(o =>{
                if(o.timestamp > ancient){
                    ancient = o.timestamp;
                    latest_price = o;
                }
            });
            console.log(latest_price);
            medicine.set('latest_price', latest_price, {strict:false});
            medicine.save();
        });
    });
}
*/
/*
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
*/


/* GET home page. */
/* currently switch to external source mode
router.get('/', function(req, res) {
    //medicine schema upgrade
    //medicineSchemaUpgrade();
    var medicines = [];
    Medicine.find({}, 'name -_id', function(err, medicineNames){
        if(err) console.log(err);
        medicineNames.forEach(function(medicine){
            medicines.push(medicine['name']);
        });
        //console.log(medicines);
        res.render('index', { user: 'test', medicines:medicines });
    });


});
*/
/* GET home page. (simplified)*/
router.get('/', function(req, res){
    res.render('index', {user: req.user});
});

router.get('/search', acl.checkPermission('medicine', 'view'), function(req, res){
    Medicine.find({name:new RegExp(req.query.keyword, 'i')}, function(err, medicines){
        if(err){
            req.flash('err', 'No such medicine!');
            return req.redirect('/');
        }
        res.render('search', {user: req.user, medicines: medicines});
    });
});

router.get('/login', function(req, res){
    res.render('login', {user:req.user});
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

router.get('/.well-known/acme-challenge/:id', function(req, res){
    res.send(process.env.SSL_TOKEN);
});

module.exports = router;
