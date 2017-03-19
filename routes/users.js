var express = require('express');
var router = express.Router();
var User = require('../model/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.get('/login', function(req, res){

});

router.get('/:name', function(req, res){
    res.render('profile', {user:req.user})
});


module.exports = router;
