/**
 * Created by s955281 on 3/14/16.
 */
var express = require('express');
var router = express.Router();

var Medicine = require('../model/medicine');
var acl = require('../config/acl');
var util = require('util');
const path = require('path');
/* GET users listing. */
router.get('/', acl.checkPermission('medicine', 'view'), function(req, res, next) {
    Medicine.find(function(err, medicines){
       if(err){
           return next(err);
       }
       res.render('medicine/medicine', {user:'dev', medicines: medicines});
    });
    //res.render('medicine', {user:'dev'});
});

router.get('/addmed', acl.checkPermission('medicine', 'edit'), function(req, res, next){
    res.render('medicine/addmed', {user:'dev', today: new Date().toISOString().substring(0, 10)});
});


router.get('/:name', acl.checkPermission('medicine', 'view'), function(req, res, next){
    Medicine.findOne({name:req.params.name}, function(err, medicine){
        if(!medicine){
            console.log('no this medicine ' + req.params.name + ' found');
            return res.redirect('/');
        }
        res.render('medicine/medinfo', {user:'dev', medicine: medicine, today: new Date().toISOString().substring(0, 10)});

        //update the latest_price field
        /*
        var latest_price = medicine.prices[0];

        medicine.prices.forEach(function(priceData){
            if (priceData.timestamp > latest_price.timestamp) latest_price = priceData;
        });
        if (typeof(medicine.latest_price.timestamp) ==='undefined' || medicine.latest_price.timestamp < new Date(req.body['date'])) {
            update = {
                $set: {
                    name: req.body['name'],
                    position: req.body['position'],
                    row: req.body['row'],
                    col: req.body['col'],
                    index: req.body['index'],
                    info: req.body['info'],
                    latest_price: {
                        price: latest_price['price'],
                        unit: latest_price['unit'],
                        timestamp: latest_price['timestamp']
                    }
                }
            }
        }
         */
    })
});



router.get('/edit/:name', acl.checkPermission('medicine', 'view'), function(req, res, next){
   Medicine.findOne({name: req.params.name}, function(err, medicine){
       if(!medicine){
           console.log('no this medicine ' + req.params.name + ' found');
           return res.redirect('/');
       }
       res.render('editmed', {user:'dev', medicine: medicine});
   })
});

router.post('/edit/:name', acl.checkPermission('medicine', 'edit'),  function(req, res, next){

    //default condition

    var conditions = {
            name: req.params.name
        }, update = {
            $set:
            {
                name: req.body['name'],
                position: req.body['position'],
                row: req.body['row'],
                col: req.body['col'],
                index: req.body['index'],
                latest_price: {price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']},
                classified_price:req.body['classified_price'],
                info: req.body['info']
            },
            $addToSet:
            {
                prices: {price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']}}
            },
            options = {multi:false};


    Medicine.findOne({name: req.params.name, col: req.body['col'], row: req.body['row']}, function(err, medicine) {
        if (!medicine) {
            console.log('no ' + req.params.name + ' found');
            return res.redirect('/');
        }
        /*
        if (typeof(medicine.latest_price.timestamp) ==='undefined' || medicine.latest_price.timestamp < new Date(req.body['date'])){
            update = {
                $set: {
                    name: req.body['name'],
                    position: req.body['position'],
                    row: req.body['row'],
                    col: req.body['col'],
                    index: req.body['index'],
                    info: req.body['info'],
                    latest_price: {price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']},
                    classified_price:req.body['classified_price']
                },
                $addToSet: {
                    prices: {price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']}
                }
            }
        }
        */

        if(util.isArray(medicine.prices)) {

            Medicine.update(conditions, update, options, function (err, medicine) {
                if (!medicine) {
                    console.log('no this medicine ' + req.params.name + ' found');
                    return res.redirect('/');
                }
                if (err) {
                    console.log(err);
                }
                return res.redirect('/medicine');
            });
        } else {

            update = {
                $set: {
                    name: req.body['name'],
                    position: req.body['position'],
                    prices: [{price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']}],
                    row: req.body['row'],
                    col: req.body['col'],
                    index: req.body['index'],
                    info: req.body['info'],
                    latest_price: {price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']},
                    classified_price:req.body['classified_price']
                }
            };

            Medicine.update(conditions, update, options, function (err, medicine) {
                if (!medicine) {
                    console.log('no this medicine ' + req.params.name + ' found');
                    return res.redirect('/');
                }
                if (err) {
                    console.log(err);
                }
                return res.redirect('/medicine');
            });
        }
    });


});




//Create new medicine
router.get('/addmed', function(req, res){
    res.render('addmed', {user:'dev'});
});

router.post('/addmed', function(req, res){

    var newMed = new Medicine({
        name: req.body['medname'],
        prices: [{price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']}],
        latest_price: {price: req.body['price'], unit: req.body['unit'], timestamp: req.body['date']},
        position: req.body['position'],
        row: req.body['row'],
        col: req.body['col'],
        index: req.body['index'],
        info: req.body['intro']
    });

    //todo: get medicine info from website using crawler

    newMed.save(function(err){
        if(err) throw err;
        console.log("Medicine saved successfully!");
        generateTypeData();
    });

    res.redirect('/medicine');
});


var fs = require('fs');

router.get('/export/pricedata', acl.checkPermission('medicine', 'edit'), function(req, res){

    var data = [];
    Medicine.find({'prices.price':{$gt:0}}, function(err, medicines){
        medicines.forEach(function(medicine){
            data += medicine.name + ':' + medicine.prices[medicine.prices.length - 1].price + ',';
        });
        console.log(data);
        fs.writeFile(__dirname + '/export.csv', data, function(err){
            if (err) console.log(err);
            res.sendFile(__dirname + '/export.csv', function(err){
                if(err) console.log(err);
                fs.unlink(__dirname + '/export.csv', function(err){
                    if(err) console.log(err);
                })
            });
        });

    });
});

router.get('/export/typedata', acl.checkPermission('medicine', 'edit'), function(req, res){
    "use strict";
    let data = [];
    Medicine.find((err, medicines)=>{
        if(err) console.log(err);
        medicines.forEach(medicine => {
            data.push(medicine.name);
        });
        fs.writeFile(process.env._ROOTPATH + '/public/typedata.json', JSON.stringify(data), (err) => {
            if(err) console.log(err);
            res.sendFile(process.env._ROOTPATH + '/public/typedata.json', function(err){
                if(err) console.log(err);

            });
        })
    })
});

function generateTypeData(){
    "use strict";

    let data = [];
    Medicine.find((err, medicines)=>{
        if(err) console.log(err);
        medicines.forEach(medicine => {
            data.push(medicine.name);
        });
        fs.writeFile(process.env._ROOTPATH + '/public/typedata.json', JSON.stringify(data), (err) => {
            if(err) console.log(err);

        });
    })

}

module.exports = router;
