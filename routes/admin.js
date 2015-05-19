var express = require('express'), router = express.Router();
var auth = require('../modules/auth');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var _ = require('underscore');

router.get('/admin/access', allow_admin, function (req, res) {
    var users = User.find({}, function(err, obj) {
        if (err) throw err;

        var toSend = _.sortBy(obj, function(user) {
            return user.cip;
        });

        if (req.query.hasOwnProperty('success')) {
            res.render('adminaccess', {
                users: toSend,
                successMessage: 'The changes were made successfully'
            });
        } else {
            res.render('adminaccess', { users: toSend });
        }
    });
});

router.post('/admin/access', allow_admin, function(req, res) {
    var usersAccess = req.body;
    User.find({}, function(err, users) {
        usersAccess.forEach(function (userAccess) {
            User.findOne({ cip: userAccess.cip }, function (err, user) {
                if (err) throw err;

                user.rights = parseInt(userAccess.rights);
                user.save(function (err) {
                    if (err) throw err;
                });
            });
        });

        res.send({ redirect: '/admin/access?success' });
    });
});

module.exports = router;