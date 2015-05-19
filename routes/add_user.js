require('../models/user.js');
var mongoose = require("mongoose");
var User = mongoose.model('User');

module.exports = function(req, res) {
	var infos = req.body;
  var user = new User({
	  cip: infos.cip,
	  prenom: infos.prenom,
	  nom: infos.nom,
	  email: infos.email,
	  concentration: infos.concentration,
	  promo: infos.promo
	});
	
	user.save(function(err) {
    if (err) throw err;
    res.redirect('/');
  });
};