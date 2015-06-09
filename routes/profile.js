require('../models/user.js');
var auth = require("../modules/auth");
var config = require('../config/config.js');
var depts = require('../models/depts.js');
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var User = mongoose.model('User');

router.get('/profile', auth.bounce, function(req, res) {
  console.log('GET: ');
  console.log(req.session.userInfo);
  res.render('profile', {
    depts: depts,
    userInfo: req.session.userInfo,
    regExes: config.standards.htmlRegExes
  });
});

router.post('/profile', auth.bounce, function(req, res) {
  var infos = req.body;
  // Sanity Checks
  if (req.session.userInfo.cip.toString().toLocaleLowerCase().localeCompare(infos.cip.toString().toLocaleLowerCase()) === 0) {
    User.findOneAndUpdate({cip: req.session.userInfo.cip}, {$set: { // update
      prenom: infos.prenom,
      nom: infos.nom,
      email: infos.email,
      phone: infos.phone,
      concentration: infos.dept,
      promo: infos.promo,
      ageguname: infos.ageguname
    }}, { //options
      new: true, // Returns new values instead of old values
      runValidators: true // Force entries validation on update
    }, function (err, doc) { //callback
      // Reload profile Page
      if (err) {
        // For future use, maybe, looks fine for now
        console.log(err);
      }
      if (doc) {
        req.session.userInfo = doc;
        console.log(req.session.userInfo);
      } else {
        console.log('No Doc Returned?!?');
      }
      res.render('profile', {
        depts: depts,
        err: err,
        userinfo: req.session.userInfo,
        regExes: config.standards.htmlRegExes
      });
    });
  } else {
    // CIPs doesn't match, someone wants to meddle with somebody else's infos
    console.log('Bounced: '+req.session.userInfo.cip+' attempting to access '+infos.cip);
    res.status(403);
    res.render('profile', {
      depts: depts,
      userInfo: req.session.userInfo,
      regExes: config.standards.htmlRegExes
    });
    // TODO: Fail2Ban?
  }
});

router.post('/profile/ajax', function (req, res) {
  var infos = req.body;
  if (typeof(req.session.userInfo) === 'undefined') {
    // User session timed out
    // Force user to re-Authenticate
    res.sendStatus(401);
  } else {
    console.log(infos);
    User.findOneAndUpdate({cip: req.session.userInfo.cip}, {$set: infos}, { //options
      new: true, // Returns new values instead of old values
      runValidators: true // Force entries validation on update
    }, function (err, doc) { //callback
      // Reload profile Page
      if (err) {
        // For future use, maybe, looks fine for now
        console.log(err);
        res.status(207); // Multiple Status, error object enclosed.
        res.send(JSON.stringify(err.errors));
      } else {
        res.sendStatus(200); // OK
      }
      if (doc) {
        delete req.session.userInfo;
        req.session.userInfo = doc;
        //Object.keys(req.session.userInfo).forEach(function (key) {
        //  console.log(key+': '+doc[key]);
        //  req.session.userInfo[key] = doc[key];
        //});
        console.log(req.session.userInfo);
      } else {
        console.log('No Doc Returned?!?');
      }
    });
  }
});

module.exports = router;