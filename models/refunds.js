var autoIncrement = require('mongoose-auto-increment');
var config = require('../config/config.js');
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
  cip: {
    match: config.standards.regExes.cip,
    type: String
  },
  bills: [
    {
      billID: {
        required: true,
        type: Number
      },
      filename: String,
      notes: String,
      supplier: {
        //match: config.standards.regExes.text,
        type: String
      },
      value: Number
    }
  ],
  billCount: Number,
  category: {
    //match: config.standards.regExes.text,
    type: String
  },
  notes: {
    //match: config.standards.regExes.longText,
    type: String
  },
  reference: {
    //match: config.standards.regExes.text,
    type: String
  },
  reviewDate: Date,
  reviewer: String,
  reviewNote: String,
  submitDate: Date,
  /**
  * 0 - Denied
  * 1 - Partly Granted
  * 2 - Granted
  **/
  status: Number, 
  total: Number
});

// AutoIncrements
RefundSchema.plugin(autoIncrement.plugin, { model: 'Refunds', field: 'refundID' });
//RefundSchema.plugin(autoIncrement.plugin, { model: 'Refunds', field: 'bills.billID' });

// TODO: Validation rules for other fields

function validateInput(input, regEx) {
  /* Arguments:
   * input: The field to validate
   * regEx: The regEx against which the input will be tested
   */
  return regEx.test(input);
}

mongoose.model('Refunds', RefundSchema);