/**
 * Created by s955281 on 3/15/16.
 */
var mongoose = require('mongoose');
//mongoose.connect(process.env.VEDABASE_MLAB);
mongoose.connect(process.env.VEDABASE_LOCAL, function(err){
    if(err) throw err;
});
console.log('connected!');
module.exports = mongoose;