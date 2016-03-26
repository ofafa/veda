/**
 * Created by s955281 on 3/14/16.
 */
var express = require('express');
var router = express.Router();

var Medicine = require('../model/medicine');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Medicine.find(function(err, medicines){
       if(err){
           return next(err);
       }
       res.render('medicine', {user:'dev', medicines: medicines});
    });
    //res.render('medicine', {user:'dev'});
});

router.get('/addmed', function(req, res, next){
    res.render('addmed', {user:'dev'});
});

router.get('/:name', function(req, res, next){
    Medicine.findOne({name:req.params.name}, function(err, medicine){
        if(!medicine){
            console.log('no this medicine ' + req.params.name + ' found');
            return res.redirect('/');
        }
        console.log(medicine);
        res.render('medinfo', {user:'dev', name: medicine.name, price: medicine.price});
    })
});

module.exports = router;
