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
    res.render('medicine/addmed', {user:'dev'});
});

router.get('/:name', acl.checkPermission('medicine', 'view'), function(req, res, next){
    Medicine.findOne({name:req.params.name}, function(err, medicine){
        if(!medicine){
            console.log('no this medicine ' + req.params.name + ' found');
            return res.redirect('/');
        }
        res.render('medicine/medinfo', {user:'dev', medicine: medicine});
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
    //todo: update the data in database
    var conditions = {
        name: req.params.name,
        }, update = {$set:{
        name: req.body['name'],
        prices: [{price: req.body['price'], timestamp: Date.now()}],
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

router.get('/medinfo/:name', acl.checkPermission('medicine', 'view'), function(req, res){
    Medicine.findOne({name: req.params.name}, function(err, medicine){
        if(err) {
            console.log(err);
            return callback(err);
        }
        res.render('medinfo', {user:'dev', medicine: medicine});
    });

});

module.exports = router;
