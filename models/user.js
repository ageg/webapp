var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	cip: String,
	prenom: String,
	nom: String,
	email: String,
	concentration: String,
    promo: Number,
    rights: Number
});

UserSchema.methods = {
  name: function () {
    return this.prenom + ' ' + this.nom;
  }
}

module.exports = UserSchema;

mongoose.model('User', UserSchema);