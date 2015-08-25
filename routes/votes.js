require('../models/vote.js');
var auth = require('../modules/auth'); // Module use for all authentification on server
var config = require('../config/config');
var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var idRegEx = /\d+/;
var mongoose = require("mongoose");
var router = express.Router();
var url = require('url');
var Vote = mongoose.model('Votes');

router.get('/votes', function (req, res) {
  Vote.find({
    endDate: {
      $gt: Date()
    },
    startDate: {
      $lt: Date()
    }
  }, function (err, entries) {
    if(err) throw err;
    res.json(entries);
  });
});

/* * * * * * * * * * * * * * * * * * * * *
 * REST MAP VOTES ADMIN
 * 
 * POST:
 *    GLOBAL: CREATE Entry (Success Reply: 201)
 *    SPECIFIC: ERROR 400
 * 
 * GET:
 *    GLOBAL: GET All entries (Success Reply: 200)
 *    SPECIFIC: GET Specific entry details (Success Reply: 200)
 * 
 * PUT:
 *    GLOBAL: ERROR 400
 *    SPECIFIC: UPDATE specific entry (Success Reply: 200)
 * 
 * DELETE:
 *    GLOBAL: ERROR 400
 *    SPECIFIC: DELETE Specific Entry? (Success Reply: 204? Error Reply: 403?)
 * 
 * * * * * * * * * * * * * * * * * * * * */

router.get('/votesAdmin', function (req, res) {
  Vote.find({creator: req.session['cas_user']}, function (err, entries) {
    if(err) throw err;
    res.json(entries);
  });
});

router.get('/votesAdmin/:id', function (req, res) {
  if (typeof(req.session['cas_user']) === 'undefined') {
    res.sendStatus(401);
  } else {
    Vote.findOne({
      'voteID': parseInt(req.params.id)
    }, { // Projection
      _id: false,
      __v: false
    }, function (err, entry) {
      if(err) throw err;
      res.json(entry);
    });
  }
});

router.post('/votesAdmin', function (req, res) {
  if (typeof(req.session['cas_user']) === 'undefined') {
    res.sendStatus(401);
  } else {
    // Create new entry in DB
    var infos = req.body;
    var vote = new Vote({
      creator: req.session['cas_user']
    });
    vote.save({
      // Options
      fields: {
        _id: false,
        __v: false
      }
    }, function(err, entry) {
      if (err) {
        throw err;
      }
      res.json({
        err: err,
        vote: entry
      });
    });
  }
});

router.post('/votesAdmin/:id', function (req, res) {
  res.sendStatus(400);
});

router.put('/votesAdmin', function (req, res) {
  res.sendStatus(400);
});

router.put('/votesAdmin/:id', function (req, res) {
  if (req.session['cas_user'] === undefined) {
    res.sendStatus(401);
  } else {
    //if (req.session['cas_user'] === req.body.creator)
    Vote.findOneAndUpdate({
      voteID: parseInt(req.params.id)
    },{ // Operations
      $set: req.body
    }, { // Options
      fields: {
        _id: false,
        __v: false,
        'votes.vote': false
      },
      new: true, // Returns new values instead of old values
      runValidators: true // Force entries validation on update
    }, function (err, entry) {
      if (err) {
        console.log(err);
        //throw err;
      }
      res.json(entry);
    });
  }
});

module.exports = router;