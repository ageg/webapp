var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	cip: String,
	prenom: String,
	nom: String,
	promo: Number,
	concentration: String
});

UserSchema.methods = {
  name: function () {
    return this.prenom + ' ' + this.nom;
  }
}

mongoose.model('User', UserSchema);