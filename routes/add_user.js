require('../models/user.js');
var auth = require("../modules/auth");
var mongoose = require("mongoose");
var User = mongoose.model('User');

module.exports = function(req, res) {
    var infos = req.body;
    User.count({}, function (err, count) {
        if (err) throw err;

        var user;
        if (count == 0) {
            user = new User({
                cip: infos.cip,
                prenom: infos.prenom,
                nom: infos.nom,
                email: infos.email,
                phone: infos.phone,
                concentration: infos.concentration,
                promo: infos.promo,
                rights: auth.adminRights.ADMIN,
                ageguname: ''
            });
        } else {
            user = new User({
                cip: infos.cip,
                prenom: infos.prenom,
                nom: infos.nom,
                email: infos.email,
                phone: infos.phone,
                concentration: infos.concentration,
                promo: infos.promo,
                rights: auth.adminRights.NONE,
                ageguname: ''
            });
        }

        req.session.userInfo = user;
        user.save(function(err) {
            if (err) throw err;
            res.redirect('/');
        });
    });
};