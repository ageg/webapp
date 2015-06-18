var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cnx = mongoose.createConnection("mongodb://localhost/ageg");
autoIncrement.initialize(cnx);

var RefundSchema = new Schema({
  refundID: {
    index: { unique: true },
    required: true,
    type: Number
  },
  cip: String,
  bills: [
    {
      billID: Number,
      notes: String,
      supplier: String,
      value: Number
    }
  ],
  billCount: Number,
  category: String,
  notes: String,
  reference: Number,
  submit_date: Date,
  status: Number,
  total: Number
});

var RequestBillSchema = new Schema({
  billID: Number,
  notes: String,
  requestID: Number,
  supplier: String,
  value: Number
});

// AutoIncrements
RefundSchema.plugin(autoIncrement.plugin, { model: 'Refunds', field: 'refundID' });

// Validation
// CIP format validation
RefundSchema.path('cip').validate(function (cip) {
  return /[a-zA-Z]{4}\d{4}/i.test(cip);
}, 'Le CIP fourni ne respecte pas le format standard du CIP (ex: AGEG1337).');

// TODO: Validation rules for other fields

mongoose.model('Refunds', RefundSchema);
mongoose.model('Bill', RequestBillSchema);