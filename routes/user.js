require('../models/user.js');
var ageg = require("../modules/ageg");
var auth = require("../modules/auth");
var config = require('../config/config.js');
var depts = require('../models/depts.js');
var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var User = mongoose.model('User');

/* * * * * * * * * * * * * * * * * * * * *
 * REST MAP
 * 
 * POST: (Create)
 *    GLOBAL: ERROR 400
 *    SPECIFIC: ERROR 400
 * 
 * GET: (Read)
 *    GLOBAL: GET current user entry (Success Reply: 200)
 *    SPECIFIC: GET Specific entry details (Success Reply: 200) TODO
 * 
 * PUT: (Update)
 *    GLOBAL: UPDATE current entry (Success Reply: 200)
 *    SPECIFIC: UPDATE specific entry? (Success Reply: 200) TODO
 * 
 * DELETE: (Delete)
 *    GLOBAL: ERROR 400
 *    SPECIFIC: ERROR 400
 * 
 * * * * * * * * * * * * * * * * * * * * */

router.get('/user', function(req, res) {
  /**
  * Request the current user info
  **/
  var tmp = {};
  if (req.session.cas_user === undefined) {
    res.json({cip: undefined});
  } else {
    User.findOne({
      cip: req.session.cas_user
    }, {
      __v: false,
      _id: false
    }, function (err, obj) {
      if (obj) {
      tmp = obj;
      } else {
        var user = new User({
          cip: req.session.cas_user,
          prenom: req.session.cas_userinfo !== undefined ? req.session.cas_userinfo.prenom : '',
          nom: req.session.cas_userinfo !== undefined ? req.session.cas_userinfo.nomfamille : '',
          email: req.session.cas_userinfo !== undefined ? req.session.cas_userinfo.courriel : '',
          rights: auth.adminRights.NONE,
          ageguname: ''
        }).save(function (err) {
          if (err) {
            throw err;
          } else {
            tmp = user;
          }
        });
      }
      res.json(tmp);
    });
  }
});

// POST Requests -> Create Actions -> New users are created when a new user logs in from CAS
router.post('/user/', function(req, res) {
  res.sendStatus(400);
});

router.post('/user/:id', function(req, res) {
  res.sendStatus(400);
});

// PUT Requests -> Update
router.put('/user', function(req, res) {
  var infos = req.body;
  if (req.session['cas_user'] === undefined || infos.cip === undefined || req.session['cas_user'] !== infos.cip) {
    // No active session or user is trying to override somebody else's session
    res.sendstatus(401);
  } else {
    User.findOneAndUpdate({ // Selection Params
      cip: infos.cip
    }, { // New Values
      $set: infos
    }, { // Operation Options
      fields: {
        _id: false,
        __v: false
      },
      new: true, // Returns new values instead of old values
      runValidators: true // Force entries validation on update
    }, function (err, entry) {
      if (err) {
        console.log(err);
        //throw err;
      }
      res.status(200);
      res.json(entry);
    });
  }
});

// DELETE Requests -> Delete Actions -> This action does not apply to user tables
router.delete('/user/', function(req, res) {
  res.sendStatus(400);
});

router.delete('/user/:id', function(req, res) {
  res.sendStatus(400);
});

module.exports = router;