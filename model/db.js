/**
 * Created by s955281 on 3/15/16.
 */
var mongoose = require('mongoose');

mongoose.connection.on('open', function(ref){
    console.log('Connect to Mongo server');
});

mongoose.connection.on('error', function(err){
    console.log('Cannot connect to mongo server!');
});

mongoose.connect(process.env.VEDABASE, function(err){
    if(err) throw err;
    console.log('connected!');
});


module.exports = mongoose;