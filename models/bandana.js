var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var EditionSchema = new Schema({
  name: String,
  price: Number
});

var TagSchema = new Schema({
  name : String,
  price: Number,
  editions: [ObjectId]
});

var TagTypeSchema = new Schema({
  name : String,
  defaultprice : Number,
  pricedescription: String,
  tags : [ObjectId]
});

mongoose.model('TagType', TagTypeSchema);
mongoose.model('Tag', TagSchema);
mongoose.model('TagEdition', EditionSchema);