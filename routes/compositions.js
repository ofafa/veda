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
        res.render('composition/compositions', {user:'dev', compositions: compositions});
    })

});


router.get('/add', acl.checkPermission('medicine', 'edit'), (req, res) => {
    //add a composition
    res.render('composition/addComposition', {user:'test'});
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

    res.redirect('back');

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
        res.render('composition/compoInfo', {user: 'dev', composition: composition});
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