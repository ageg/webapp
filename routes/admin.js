var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var _ = require('underscore');
var rights = require('../config/rights.js')

router.get('/admin/access', allow_admin, function (req, res) {
  User.find({rights: {$not: {$size: 0}}}, function (err, dbUsers) {
    if (err) throw err;
    
    var sortedUsers = _.sortBy(dbUsers, function (user) {
      return user.cip;
    });
    
    res.render('adminaccess', { users: sortedUsers });
  });
});

router.get('/admin/findCIP', allow_admin, function (req, res) {
  User.findOne({ cip: req.query.cip }, function (err, obj) {
    res.json({user: obj, rights: rights.list});
  });
});

router.post('/admin/addRight', allow_admin, function (req, res) {
  User.update({cip: req.body.cip}, {$push: {rights: req.body.right}}, function(err, obj) {
    if (err) throw err;
    res.end();
  });
});

router.post('/admin/removeRight', allow_admin, function (req, res) {
  User.update({cip: req.body.cip}, {$pull: {rights: req.body.right}}, function(err, obj) {
    if (err) throw err;
    res.end();
  });
});

module.exports = router;