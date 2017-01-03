/**
 * Created by s955281 on 08/12/2016.
 */
var Medicine = require('../model/medicine');
var fs = require('fs');
var medicines = [];



var typeaheadcfg = function(){

        Medicine.find({}, 'name -_id', function(err, medicineNames) {
            if (err) console.log(err);
            medicineNames.forEach(function (medicine) {
                medicines.push('"' + medicine['name'] + '"');
            });
            //console.log('write meddata');
            //console.log(medicines);
            fs.writeFile('./public/typedata.json', '[' + medicines.toString() + ']', function(err){
                if(err) console.log(err);
            })
        });
};

module.exports = typeaheadcfg;
