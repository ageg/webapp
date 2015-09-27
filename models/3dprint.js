var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config/config.js') 

var cnx = mongoose.createConnection("mongodb://localhost/ageg");
autoIncrement.initialize(cnx);

var PrintSchema = new Schema({
  cip: { type: String, required: true}, 
  job: {
    [
      {
        fileName: { type: String, required: true},
        picName: {type: String, required: true}
      }
    ]
  },
  price: Number,
  sDate: Date,
  status: Number,
  weight: Number
});

mongoose.model('Print', PrintSchema);