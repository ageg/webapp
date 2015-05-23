var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var item_for_rent_schema = new Schema({
    name: { type: String, unique: true },
    type : String,
    description: String,
    quantity: Number,
    Price_per_day: Number,
    deposit_standard : Number,
    deposit_cleanup: Number,
    type_specific  : {}
});

module.exports = item_for_rent_schema;

mongoose.model('item_for_rent', item_for_rent_schema);