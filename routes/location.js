require('../models/item_for_rent.js');
require('../models/rent')
var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var items = mongoose.model('item_for_rent');
var rents = mongoose.model('rent');
var auth = require('../modules/auth');

router.get("/add_location" , auth.bounce, function (req, res) {

    items.find({}, function (err, item) {
       // res.json(JSON.stringify(item));
      res.render("add_location", { data : item } )
    });
});

router.post("/add_location", auth.bounce, function (req, res) {
    res.json(req.body);
    var request = req.body;
    request.item.forEach(function (item){
        var item_id = item.split("_")[1];
        getCountOfItemsRentable(item_id, request.start_time, request.end_time, request.start_date, request.start_time);
    });
});

router.get("/edit_location", allow_permie, function (req, res) {
    items.find({}, function (err, dbItems) {
        if (err) throw err;
        
        res.render('edit_location', { items: JSON.stringify(dbItems) });
    });
});

getCountOfItemsRentable = function (item_id, start_time, end_time, start_date, end_date)
{
    return items.findOne(item_id, function (err, item) {
        var maxQuantity = item.toObject().quantity;
        return maxQuantity;
    });
      
}
module.exports = router;

