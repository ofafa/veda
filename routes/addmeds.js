/**
 * Created by s955281 on 3/14/16.
 */
var express = require('express');
var router = express.Router();
var Medicine = require('../model/medicine');


router.get('/', function(req, res){
    res.render('addmed', {user:'dev'});
});

router.post('/', function(req, res){

    var newMed = new Medicine({
        name: req.body['medname'],
        price: req.body['price'],
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