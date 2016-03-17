/**
 * Created by s955281 on 3/14/16.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('medicine', {user:'dev'});
});

router.get('/addmed', function(req, res, next){
    res.render('addmed', {user:'dev'});
});

router.post('/addmed', function(req, res){
    //todo: add form data into database
});

module.exports = router;
