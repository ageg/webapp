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
});

/*UserSchema.methods = {
  name: function () {
    return this.prenom + ' ' + this.nom;
  }
}*/

mongoose.model('Request', RequestSchema);