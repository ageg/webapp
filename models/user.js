var dept = require('../config/depts.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config/config.js') 

var UserSchema = new Schema({
  cip: { type: String, required: true, unique: true }, 
  prenom: String,
  nom: String,
  email: String,
  concentration: {type: String, enum: dept.list},
  phone: String,
  promo: Number,
  rights: [String, { type: String, enum: config.rights.list }]
});

UserSchema.methods = {
  name: function () {
    return this.prenom + ' ' + this.nom;
  }
}

mongoose.model('User', UserSchema);