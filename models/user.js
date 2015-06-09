var config = require('../config/config.js');
var dept = require('./depts.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  ageguname: String,
  cip: String,
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

// CIP format validation
UserSchema.path('cip').validate(function (cip) {
  return /[a-zA-Z]{4}\d{4}/i.test(cip);
}, 'Le CIP fourni ne respecte pas le format standard du CIP (ex: AGEG1337).');

// Email Validation
UserSchema.path('email').validate(function (email) {
  return config.standards.regExes.email.test(email);
}, 'Le courriel fourni est invalide.');

// First Name Validation
UserSchema.path('prenom').validate(function (prenom) {
  return config.standards.regExes.name.test(prenom);
}, 'Le prénom fourni est invalide.');

// Last Name Validation
UserSchema.path('nom').validate(function (nom) {
  return config.standards.regExes.name.test(nom);
}, 'Le nom fourni est invalide.');

// Phone Validation
UserSchema.path('phone').validate(function (phone) {
  return config.standards.regExes.phone.test(phone);
}, 'Le numéro de téléphone fourni est invalide.');

// Promotion Validation
UserSchema.path('promo').validate(function (promo) {
  return config.standards.regExes.promo.test(promo);
}, 'Le numéro de promotion fourni est invalide.');

// Department Validation
// TODO: THIS

// AGEG LDAP Username validation
UserSchema.path('ageguname').validate(function (uname) {
  return config.standards.regExes.uname.test(uname);
}, 'Le nom d\'utilisateur du réseau de l\'AGEG fourni est invalide.');

mongoose.model('User', UserSchema);