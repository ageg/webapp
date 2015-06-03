require('../models/user.js');
var auth = require("../modules/auth");
var mongoose = require("mongoose");
var User = mongoose.model('User');

module.exports = function(req, res) {
    var infos = req.body;
    var user;
    user = new User({
        cip: infos.cip,
        prenom: infos.prenom,
        nom: infos.nom,
        email: infos.email,
        concentration: infos.concentration,
        promo: infos.promo
    });

    user.save(function(err) {
        if (err) throw err;
        req.session.userInfo = user;
        res.redirect('/');
    });
};