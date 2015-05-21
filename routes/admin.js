var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var _ = require('underscore');

router.get('/admin/access', allow_admin, function (req, res) {
  User.find({}, function (err, dbUsers) {
    if (err) throw err;
    
    var sortedUsers = _.sortBy(dbUsers, function (user) {
      return user.cip;
    });
    
    if (req.query.hasOwnProperty('success')) {
      res.render('adminaccess', {
        users: sortedUsers,
        successMessage: 'The changes were made successfully'
      });
    } else {
      res.render('adminaccess', { users: sortedUsers });
    }
  });
});

router.post('/admin/access', allow_admin, function (req, res) {
  var usersAccess = req.body;
  User.find({}, function (err, users) {
    users.forEach(function (user) {
      if (usersAccess[user.cip + ".cip"]) {
        user.rights = parseInt(usersAccess[user.cip + ".rights"]);
        user.save(function (err) {
          if (err) throw err;
        });
      }
    });
    
    res.redirect('/admin/access?success');
  });
});

module.exports = router;