var dept = require('../config/depts.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  cip: { type: String, index: { unique: true } },
  prenom: String,
  nom: String,
  email: String,
  concentration: {type: String, enum: dept.list},
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