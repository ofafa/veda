/**
 * Created by s955281 on 6/28/16.
 */
var acl = require('acl');
var mongoose = require('../model/db');

mongoose.connection.on('connected', function(error){
    if (error) throw error;
    console.log('connection on!');
    console.log(mongoose.connection.readyState);
    acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));

    initPermissions();
    initRoles();

});


//test
function initPermissions(err){
    acl.allow('guest', ['medicine', 'users'], ['view']);
    acl.allow('admin', ['medicine', 'users'], ['view', 'edit']);
}


function initRoles(err){
    acl.addUserRoles('5760292235f1dcf9390d9803', 'guest', function(err){
        if(err) {
            console.log(err);
            return err;
        }
    });
    acl.addUserRoles('576181eb97c977cd3e62975b', 'admin');

}


acl.checkPermission = function(resource, action){
    var middleware = false;
    return function(req, res, next){
        //check if this is a middleware call
        if(next){
            middleware = true;
        }
        if (req.user == null) return res.redirect('/login');
        var uid = req.user.id;

        //permission check
        acl.isAllowed(uid, resource, action, function(err, result){
            // return results in the appropriate way
            switch (middleware){
                case true:
                    console.log('case true');
                    if(result){
                        // user has access rights, proceed to allow access to the route
                        next();
                    } else {
                        // user access denied
                        var checkError = new Error("user does not have permission to perform this action on this resource");
                        next(checkError);// stop access to route
                        req.flash('error', 'You cannot access this page');
                        res.redirect('/');
                    }
                    return;
                    break;
                case false:
                    console.log('case false');
                    if(result){
                        // user has access rights
                        return true;
                    } else {
                        // user access denied
                        return false;
                    }
                    break;
            }


        });
    }
};
module.exports = acl;