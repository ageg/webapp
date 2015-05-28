require('../models/user.js');
var auth = require("../modules/auth");
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var User = mongoose.model('User');

router.get('/profile', auth.bounce, function(req, res) {
  res.render('profile', {userInfo: req.session.userInfo});
});

router.post('/profile', function(req, res) {
  var infos = req.body;
  // Sanity Checks
  if (req.session.userInfo.cip.toString().toLocaleLowerCase().localeCompare(req.session.userInfo.cip.toString().toLocaleLowerCase())) {
    
  } else {
    // CIPs doesn't match, someone wants to meddle with somebody else's infos
    res.sendStatus(403);
  }
});

module.exports = router;