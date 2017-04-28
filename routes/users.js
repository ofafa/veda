var express = require('express');
var router = express.Router();
var User = require('../model/user').user;


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.post('/edit/:uid', (req, res) => {
    "use strict";

    User.update({_id:req.params.uid}, {$set:{
        profile:{
            name: req.body['user_name'],
            phone: req.body['user_phone']
        },
        preference:{
            vertical_disp: req.body['compos_display_pref']
        }
    }}, (err, user) => {
        if(err)
            console.log('update user failed');
        if(!user)
            console.log('user not found!');
        return res.redirect('/profile');
    })
});

module.exports = router;
