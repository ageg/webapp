var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var mongoose = require("mongoose");
var Print = mongoose.model('Print');
var _ = require('underscore');

router.get('/3dprint/', function (req, res) {
  Print.find({}, function (err, printJobs) {
    if (err) throw err;
    
    res.json = printJobs;
  });
});

router.post('/3dprint', function (req, res) {
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