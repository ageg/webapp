require('../models/user.js');
var mongoose = require("mongoose");
var User = mongoose.model('User');

module.exports = function(req, res) {
	// TODO: pick up data from session/Mongo instead of seed
	var user = new User({
		cip: 'foug1803',
		prenom: 'Gabriel',
		nom: 'Fournier',
		email: 'gab@ageg.ca',
		concentration: 'Mécanique',
		promo: '55e'
	});
	res.render("refunds");
};