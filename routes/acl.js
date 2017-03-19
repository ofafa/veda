/**
 * Created by s955281 on 10/5/16.
 */
var express = require('express');
var router = express.Router();

var acl = require('../config/acl');
var user = require('../model/user');

router.get('/', acl.checkPermission('acl', 'view'), function(req, res){


    //get the email of local users
    user.user.find({$or:[{local:{$exists:true}}, {facebook:{$exists:true}}]}, function(err, users){
        res.render('acl', {user:'dev', users: users});
    }).select('local.email');




});

router.get('/addrole', acl.checkPermission('acl', 'view'), function(req, res){
    //todo: render addrole page
});

router.post('/addrole', acl.checkPermission('acl', 'edit'), function(req, res){
    //todo: add new role to the ACL sys
})

;

module.exports = router;