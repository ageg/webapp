require('../models/item_for_rent.js');
var mongoose = require("mongoose");
var items = mongoose.model('item_for_rent');

module.exports.get = function (req, res) {

    items.find({}, function (err, item) {
        //res.json(JSON.stringify(item[1].name));
      res.render("add_location", { data : item } )
    });
};

module.exports.post = function (req, res) {
    res.json(req.body);
};