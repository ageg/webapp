require('../models/user.js');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var auth = require("../modules/auth");
var utils = require("../modules/utils");
var express = require('express');
var config = require("../config/config.js")
var router = express.Router();

router.get('/users', function (req, res, next) {
  User.find({}, function (err, users) {
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
          rights: config.rights.list,
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
        });
      }
      
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

router.post('/users/:cip/rights', [auth.allow_admin, utils.verify_params(['right'])], function (req, res, next) {
  User.update({ cip: req.params.cip }, { $push: { rights: req.body.right } }, function (err, obj) {
    if (err) next(err);
    else {
      res.status(200);
      res.json({ message: req.body.right + ' added succesfully' });
    }
  });
});

router.delete('/users/:cip/rights', [auth.allow_admin, utils.verify_queryparams(['right'])], function (req, res, next) {
  User.update({ cip: req.params.cip }, { $pull: { rights: req.query.right } }, function (err, obj) {
    if (err) next(err);
    else {
      res.status(200);
      res.json({ message: req.body.right + ' removed succesfully' });
    }
  });
});

router.get('/user_rights', function (req, res, next) {
  res.json({ user_rights: config.rights.list });
});

router.get('/login', function (req, res) {
  if (req.session['cas_user']) {
    res.json({ cip: req.session['cas_user'] });
  } else {
    res.status(403);
    res.json({
      error: 'You need to login to access the API',
      path: '/loginCAS'
    });
  }
});

router.get('/loginCAS', auth.bounce, function (req, res) {
  res.redirect('/');
});

router.get('/logout', auth.logout);

module.exports = router;