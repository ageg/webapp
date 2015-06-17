require('../models/user.js');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var auth = require("../modules/auth");
var utils = require("../modules/utils");
var express = require('express');
var router = express.Router();

router.get('/users', function (req, res, next) {
  User.find({}, 'cip', function (err, users) {
    if (err) next(err);

    res.json(users);
  });
});

router.post('/users', utils.verify_params(['cip','prenom','nom','email','phone','concentration','promo']), function(req, res, next) {
  var infos = req.body;
  if (infos.cip == req.session['cas_user']) {
    User.count({}, function (err, count) {
      if (err) { return next(err); }
      
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
        });
      }
      
      req.session.userInfo = user;
      user.save(function (err) {
        if (err) next(err);
        else res.json(user);
      });
    });
  } else {
    res.status(400);
    res.json({ error: 'Trying to add new user with different cip than the one logged in' });
  }
});

router.get('/users/:cip', function (req, res, next) {
  User.findOne({ cip: req.params.cip }, function (err, user) {
    if (err) next(err);
    else {
      if (user) {
        res.json(user);
      }
      else {
        res.status(404);
        res.json({ error: 'Couldnt find any user with cip: ' + req.params.cip });
      }
    }  
  });
});

router.put('/users/:cip', utils.verify_params(['prenom', 'nom', 'email', 'phone', 'concentration', 'promo']), function (req, res, next) {
  infos = req.body;
  if (req.params.cip == req.session['cas_user']) {
    User.findOne({ cip: req.params.cip }, function (err, user) {
      if (err) next(err);
      else {
        if (user) {
          user.prenom = infos.prenom;
          user.nom = infos.nom;
          user.email = infos.email;
          user.phone = infos.phone;
          user.concentration = infos.concentration;
          user.promo = infos.promo;
          
          user.save(function (err) {
            if (err) next(err);
            else res.json(user);
          });
        }
        else {
          res.status(404);
          res.json({ error: 'Couldnt find any user with cip: ' + req.params.cip });
        }
      }
    });
  } else {
    res.status(400);
    res.json({ error: 'Trying to modify new user with different cip than the one logged in' });
  }
});

router.get('/login', auth.bounce, function (req, res) {
  res.json({ cip: req.session['cas_user'] });
});

module.exports = router;