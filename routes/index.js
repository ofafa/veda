var express = require('express');
var router = express.Router();
var Medicine = require('../model/medicine');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { user: 'admin' });
});


router.get('/search', function(req, res){
    console.log(req.query.keyword);
    Medicine.find({name:req.query.keyword}, function(err, medicines){
        if(err){
            console.log('no such medicine');
            return req.redirect('/');
        }
        res.render('search', {user:'dev', medicines: medicines})
    });
});

module.exports = router;
