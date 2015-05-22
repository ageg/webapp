var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
  cip: String,
  prenom: String,
  nom: String,
  email: String,
  reference: Number,
  category: String,
  bill_count: Number,
  total: Number,
  notes: String
  // TODO: Add submittedDate
});

/*RequestSchema.methods = {
  // TODO This!
  }
}*/

mongoose.model('Request', RequestSchema);