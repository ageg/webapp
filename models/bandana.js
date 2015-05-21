var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EditionSchema = new Schema({
  name: String,
  price: Number
});

var TagSchema = new Schema({
  name : String,
  price: Number,
  editions: [EditionSchema]
});

var TagTypeSchema = new Schema({
  name : { type: String, unique: true },
  defaultprice : Number,
  pricedescription: String,
  tags : [TagSchema]
});

mongoose.model('TagType', TagTypeSchema);