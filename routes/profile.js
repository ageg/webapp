require('../models/user.js');
var auth = require("../modules/auth");
var config = require('../config/config.js');
var depts = require('../config/depts.js');
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var User = mongoose.model('User');

router.get('/profile', auth.bounce, function(req, res) {
  res.render('profile', {
    depts: depts,
    userInfo: req.session.userInfo,
    regExes: config.standards.htmlRegExes
  });
});

router.post('/profile', auth.bounce, function(req, res) {
  var infos = req.body;
  // Sanity Checks
  if (req.session.userInfo.cip.toString().toLocaleLowerCase().localeCompare(req.session.userInfo.cip.toString().toLocaleLowerCase()) === 0) {
    // Prenom
    if (req.session.userInfo.prenom.toString().toLocaleLowerCase().localeCompare(infos.prenom.toString().toLocaleLowerCase()) !== 0  && config.standards.regExes.name.test(infos.prenom)) {
      req.session.userInfo.prenom = infos.prenom;
    }
    // Nom
    if (req.session.userInfo.nom.toString().toLocaleLowerCase().localeCompare(infos.nom.toString().toLocaleLowerCase()) !== 0  && config.standards.regExes.name.test(infos.nom)) {
      req.session.userInfo.nom = infos.nom;
    }
    // Email
    if (req.session.userInfo.email.toString().toLocaleLowerCase().localeCompare(infos.email.toString().toLocaleLowerCase()) !== 0 && config.standards.regExes.email.test(infos.email)) {
      req.session.userInfo.email = infos.email;
    }
    // Phone
    if (typeof(req.session.userInfo.phone) === 'undefined') {
      req.session.userInfo.phone='';
    }
    if (req.session.userInfo.phone.toString().toLocaleLowerCase().localeCompare(infos.phone.toString().toLocaleLowerCase()) !== 0 && config.standards.regExes.phone.test(infos.phone)) {
      req.session.userInfo.phone = infos.phone;
    }
    // Concentration
    if (req.session.userInfo.concentration.toString().toLocaleLowerCase().localeCompare(infos.concentration.toString().toLocaleLowerCase()) !== 0 && config.standards.regExes.concentration.test(infos.concentration)) {
      req.session.userInfo.concentration = infos.concentration;
    }
    // Promotion
    if (req.session.userInfo.promo.toString().toLocaleLowerCase().localeCompare(infos.promo.toString().toLocaleLowerCase()) !== 0 && config.standards.regExes.promo.test(infos.promo)) {
      req.session.userInfo.promo = infos.promo;
    }
    // AGEG LDAP Username
    if (typeof(req.session.userInfo.ageguname) === 'undefined') {
      req.session.userInfo.ageguname='';
    }
    if (req.session.userInfo.ageguname.toString().toLocaleLowerCase().localeCompare(infos.username.toString().toLocaleLowerCase()) !== 0 && !config.standards.regExes.uname.test(infos.username)) {
      req.session.userInfo.ageguname = infos.username;
    }
    User.findOneAndUpdate({cip: req.session.userInfo.cip}, {$set: {
      prenom: req.session.userInfo.prenom,
      nom: req.session.userInfo.nom,
      email: req.session.userInfo.email,
      phone: req.session.userInfo.phone,
      concentration: req.session.userInfo.concentration,
      promo: req.session.userInfo.promo,
      ageguname: req.session.userInfo.ageguname
    }}, {new: true}, function (err, doc) {
      // Reload profile Page
      if (err) console.log(err.message);
      res.render('profile', {
        depts: depts,
        userinfo: req.session.userInfo,
        regExes: config.standards.htmlRegExes
      });
    });
  } else {
    // CIPs doesn't match, someone wants to meddle with somebody else's infos
    res.status(403);
    res.render('profile', {
      depts: depts,
      userInfo: req.session.userInfo,
      regExes: config.standards.htmlRegExes
    });
    // TODO: Fail2Ban?
    console.log('Bounced '+req.session.userInfo.cip);
  }
});

router.post('/profiles/challenge', function (req, res) {
  // Challenge the submitted AGEG LDAP Username and password.
  
});

module.exports = router;