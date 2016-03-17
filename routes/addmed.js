/**
 * Created by s955281 on 3/14/16.
 */
var express = require('express');
var router = express.Router();
var Medicine = require('../model/medicine');


router.get('/', function(req, res, next){
    res.render('addmed', {user:'dev'});
});

router.post('/', function(req, res){
    //todo: add form data into database
    var newMed = new Medicine({
        name: req.body['medname'],
        position: req.body['position'],
        row: req.body['row'],
        col: req.body['col'],
        index: req.body['index'],
        info: req.body['intro']
    });

    console.log(newMed);

    newMed.save(function(err){
        if(err) throw err;
        console.log("Medicine saved successfully!");
    })

    res.redirect('/medicine');
});

module.exports = router;