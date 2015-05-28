var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  ID: Number,
  cip: String,
  prenom: String,
  nom: String,
  email: String,
  reference: Number,
  category: String,
  billCount: Number,
  total: Number,
  notes: String,
  submit_date: Date,
  status: Number
  // TODO: Add submittedDate
});

RequestSchema.methods = {
  listAll: function (findObj, callback) {
    this.find(findObj, callback);
  }
};

var RequestBillSchema = new Schema({
  billID: Number,
  notes: String,
  requestID: Number,
  supplier: String,
  value: Number
});

// TODO: Archives?

mongoose.model('Request', RequestSchema);
mongoose.model('Bill', RequestBillSchema);