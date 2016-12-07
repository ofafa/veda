/**
 * Created by s955281 on 3/14/16.
 */
var express = require('express');
var router = express.Router();

var Medicine = require('../model/medicine');
var acl = require('../config/acl');

/* GET users listing. */
router.get('/', acl.checkPermission('medicine', 'view'), function(req, res, next) {

    Medicine.find(function(err, medicines){
       if(err){
           return next(err);
       }
       res.render('medicine/medicine', {user:'dev', medicines: medicines});
    });
    //res.render('medicine', {user:'dev'});
});

router.get('/addmed', acl.checkPermission('medicine', 'edit'), function(req, res, next){
    res.render('medicine/addmed', {user:'dev', today: new Date().toISOString().substring(0, 10)});
});

router.get('/:name', acl.checkPermission('medicine', 'view'), function(req, res, next){
    Medicine.findOne({name:req.params.name}, function(err, medicine){
        if(!medicine){
            console.log('no this medicine ' + req.params.name + ' found');
            return res.redirect('/');
        }
        console.log(new Date().toISOString().substring(0, 10));
        res.render('medicine/medinfo', {user:'dev', medicine: medicine, today: new Date().toISOString().substring(0, 10)});
    })
});

router.get('/edit/:name', acl.checkPermission('medicine', 'view'), function(req, res, next){
   Medicine.findOne({name: req.params.name}, function(err, medicine){
       if(!medicine){
           console.log('no this medicine ' + req.params.name + ' found');
           return res.redirect('/');
       }
       res.render('editmed', {user:'dev', medicine: medicine});
   })
});

router.post('/edit/:name', acl.checkPermission('medicine', 'edit'),  function(req, res, next){

    var conditions = {
        name: req.params.name,
        }, update = {$set:{
        name: req.body['name'],
        prices: {$addToSet:{price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']}},
        position: req.body['position'],
        row: req.body['row'],
        col: req.body['col'],
        index: req.body['index'],
        info: req.body['info']}},
        options = {multi:false};

    Medicine.update(conditions, update, options, function(err, medicine){
        if(!medicine){
            console.log('no this medicine ' + req.params.name + ' found');
            return res.redirect('/');
        }
        if(err){
            return callback(err);
        }
        console.log('medicine' + req.param.name + 'updated');
        return res.redirect('/medicine');
    });
});




//Create new medicine
router.get('/addmed', function(req, res){
    res.render('addmed', {user:'dev'});
});

router.post('/addmed', function(req, res){

    var newMed = new Medicine({
        name: req.body['medname'],
        prices: [{price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']}],
        position: req.body['position'],
        row: req.body['row'],
        col: req.body['col'],
        index: req.body['index'],
        info: req.body['intro']
    });

    //todo: get medicine info from website using crawler
    console.log(newMed);

    newMed.save(function(err){
        if(err) throw err;
        console.log("Medicine saved successfully!");
    });

    res.redirect('/medicine');
});


module.exports = router;
