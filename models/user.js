var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rights = require('../config/rights.js')

var UserSchema = new Schema({
  cip: { type: String, required: true, unique: true },
  prenom: String,
  nom: String,
  email: String,
  concentration: String,
  promo: Number,
  rights: [ String, { type: String, enum: rights.list} ]
});

UserSchema.methods = {
  name: function () {
    return this.prenom + ' ' + this.nom;
  }
}

mongoose.model('User', UserSchema);
