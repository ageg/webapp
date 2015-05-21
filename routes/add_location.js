require('../models/item_for_rent.js');
var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var items = mongoose.model('item_for_rent');
var auth = require('../modules/auth');

router.get("/add_location" , auth.bounce, function (req, res) {

    items.find({}, function (err, item) {
        //res.json(JSON.stringify(item[1].name));
      res.render("add_location", { data : item } )
    });
});

router.post("/add_location", auth.bounce,  function (req, res) {
    res.json(req.body);
});

module.exports = router;