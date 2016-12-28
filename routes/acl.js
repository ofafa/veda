/**
 * Created by s955281 on 10/5/16.
 */
var express = require('express');
var router = express.Router();

var acl = require('../config/acl');
var user = require('../model/user');

router.get('/', acl.checkPermission('acl', 'view'), function(req, res){
    //initialize container
    var allUser = [];

    //get the email of local users
    user.user.find({local:{$exists:true}}, function(err, users){
        allUser.push(users);
    }).select('local.email');

    //get the email of facebook users
    user.user.find({facebook:{$exists: true}}, function(err, users){
        allUser.push(users);
    }).select('facebook.email');
    console.log(allUser);
    res.render('acl', {user:'dev', users: allUser});

});

router.get('/addrole', acl.checkPermission('acl', 'view'), function(req, res){
    //todo: render addrole page
});

router.post('/addrole', acl.checkPermission('acl', 'edit'), function(req, res){
    //todo: add new role to the ACL sys
})

;

module.exports = router;