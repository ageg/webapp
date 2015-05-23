var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var item_for_rent_schema = new Schema({
    name: { type: String, unique: true },
    description: String,
    quantity: Number,
    price: Number,
});

mongoose.model('item_for_rent', item_for_rent_schema);