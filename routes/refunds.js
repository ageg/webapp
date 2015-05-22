require('../models/refunds.js');
var mongoose = require("mongoose");
var Request = mongoose.model('Request');
var express = require('express');
var router = express.Router();

router.get('/refunds', function(req, res) {
  // Check if session exists
  if( typeof(req.session.userInfo) === 'undefined' ){
    res.redirect('/login');
    // TODO: Something awesome like redirect back to /refunds
  } else {
    res.render("refunds", {userInfo : req.session.userInfo});
  }
});

router.post('/refunds', function(req, res) {
  var infos = req.body;
  var request = new Request({
    // TODO: Sanity Checks
    cip: infos.cip,
    prenom: infos.prenom,
    nom: infos.nom,
    email: infos.email,
    request_id: infos.request_id,
    category: infos.category,
    total: infos.total,
    notes: infos.notes
  });
  console.log(infos);
  // TODO: Actual work
  
  request.save(function(err){
  if (err) throw err;
  res.redirect('/');
  });
});

module.exports = router;