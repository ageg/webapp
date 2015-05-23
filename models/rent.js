var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./user.js');
var item_for_rent = require('./item_for_rent.js');

var rent_schema = new Schema({
    user : [UserSchema],
    item : {
        item: ObjectId,
        quantity: Number,
        status: String
    },
    description: String,
    group: String,
    quantity: Number,
    start_date : Date,
    end_date : Date,
    start_time: Number,
    end_time : Number
});

mongoose.model('rent', rent_schema);