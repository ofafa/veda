/**
 * Created by s955281 on 02/02/2017.
 */
const express = require('express');
const router = express.Router();
const Composition = require('../model/composition');
const React = require('react');
const acl = require('../config/acl');

router.get('/', acl.checkPermission('medicine', 'view'), (req, res) => {
    //list all compositions
    Composition.find((err, compositions) => {
        "use strict";
        res.render('composition/compositions', {user:req.user, compositions: compositions});
    })

});


router.get('/add', acl.checkPermission('medicine', 'edit'), (req, res) => {
    //add a composition
    res.render('composition/addComposition', {user: req.user});
});

router.post('/add', acl.checkPermission('medicine', 'edit'), (req, res) => {
    "use strict";
    let ingredients = [];
    //discard empty name or empty quantity item
    req.body.items.map(item => {
        if (item.name != '' && item.q != 0 && item.q != ''){
            ingredients.push(item);
        }
    });

    let newCompo = new Composition({
        name: req.body.compo_name,
        type: req.body.compo_type,
        ingredients:ingredients,
        intro: req.body.compo_intro,
        limitation: req.body.compo_limitation,
        processing: req.body.compo_processing,
        keyword: req.body.compo_keyword,
        prices: [{price: req.body.compo_price, timestamp: req.body.compo_price_date}]
    });

    //console.log(newCompo);

    newCompo.save(err => {
        if(err) console.log(err);
    });
    //using handleRedirect in react instead
    //res.redirect('back');
});


router.post('/', (req, res) => {
    "use strict";
    console.log(req.body);
    res.redirect('back');
});

router.get('/:name',acl.checkPermission('medicine', 'view'), (req, res) =>{
    "use strict";
    //find a composition by name
    Composition.findOne({name: req.params.name}, (err, composition) => {
        if(!composition)
            return res.redirect('/');
        res.render('composition/compoInfo', {user:  req.user, composition: composition});
    });

});

router.get('/edit/:name', acl.checkPermission('medicine', 'edit'), (req, res) => {
    "use strict";
    Composition.findOne({name: req.params.name}, (err, composition) => {
        if(!composition)
            return res.redirect('/');
        res.render('composition/editComposition', {user: req.user, composition: composition, today: new Date().toISOString().substring(0, 10)});
    })
});

router.post('/edit/:name', acl.checkPermission('medicine', 'edit'), (req, res) => {
    "use strict";
    let conditions = {name: req.params.name};
    let ingredients_size = req.body.ingredients_length;
    let ingredients = [];
    console.log(ingredients_size);
    for(let i = 0; i < ingredients_size; i++){
        if(req.body['item-' + i + 'name'] != '' && req.body['item-' + i + '-q'] != 0){
            let id = 'item_' + i;
            let item = {id:id, name:req.body['item-' + i + '-name'], q:req.body['item-' + i + '-q'], unit:req.body['item-' + i + '-unit']};
            ingredients.push(item);
        }
    }

    let update = {$set:{
        name: req.body['compo_name'],
        type: req.body['compo_type'],
        ingredients: ingredients,
        intro: req.body['compo_intro'],
        limitation: req.body['compo_limitation'],
        processing: req.body['compo_processing'],
        keyword: req.body['compo_keyword']
    }, $addToSet:{
        prices:{price: req.body['compo_price'], timestamp: req.body['compo_price_date']}
    }};
    let options = {multi:false};
    Composition.update(conditions, update, options, (err, composition) => {
        if(err || !composition){
            console.log('error finding the composition');
            return res.redirect('/composition');
        }
        return res.redirect('/composition');
    });

});

router.get('/find/:tag', (req, res) =>{
    "use strict";
    //find a composition by tag
});

router.get('/find/:user', (req, res) => {
    "use strict";
    //find all the compositions belonging to a user
});

module.exports = router;