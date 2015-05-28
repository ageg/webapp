var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  ageguname: String,
  cip: String,
  prenom: String,
  nom: String,
  email: String,
  concentration: String,
  phone: String,
  promo: Number,
  rights: Number
});

UserSchema.methods = {
  name: function () {
    return this.prenom + ' ' + this.nom;
  }
}

mongoose.model('User', UserSchema);