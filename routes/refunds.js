require('../models/refunds.js');
var config = require('../config/config');
var express = require('express');
var mongoose = require("mongoose");
var multer = require('multer');
var Request = mongoose.model('Request');
var router = express.Router();

router.get('/refunds', function(req, res) {
  // Check if session exists
  if( typeof(req.session.userInfo) === 'undefined' ){
    res.redirect('/login');
    // TODO: Something awesome like redirect back to /refunds
  } else {
    // Fetch request from archives if need be
    // TODO: Actual fetching instead of automatic seeding
    
    // NEW request
    var request = new Request({
      cip: req.session.userInfo.cip,
      prenom: req.session.userInfo.prenom,
      nom: req.session.userInfo.nom,
      email: req.session.userInfo.email,
      ID: 0, // TODO: ID-Assignation routines
      billCount: 1,
      category: '',
      total: 0,
      notes: ''
    });
    res.render("refunds", {
      formulas: buildFormFormulas(request.billCount),
      reqInfo : request
    });
  }
});

router.post('/refunds', function(req, res) {
  var infos = req.body;
  var request = new Request({
    cip: req.session.userInfo.cip,
    prenom: req.session.userInfo.prenom,
    nom: req.session.userInfo.nom,
    email: req.session.userInfo.email,
    // TODO: Sanity Checks
    ID: infos.request_id,
    category: infos.category,
    total: infos.total,
    notes: infos.notes
  });
  console.log(infos);
  console.log(req.files);
  // TODO: Actual work
  
  request.save(function(err){
  if (err) throw err;
  res.render('refunds',{
    formulas: buildFormFormulas(request.billCount),
    reqInfo : request
  });
  //res.redirect('/');
  });
});

router.get('/refunds/uploads', function(req, res) {
  console.log(req);
  res.status(200);
  res.send();
});

router.post('/refunds/uploads',[ multer({dest: config.refundoptions.uploaddir}), function(req, res) {
  console.log(req);
  res.status(200);
  res.end();
}]);

router.post('/refunds/request/update', function(req, res) {
  var infos = req.body;
  var request = new Request({
    cip: req.session.userInfo.cip,
    prenom: req.session.userInfo.prenom,
    nom: req.session.userInfo.nom,
    email: req.session.userInfo.email,
    // TODO: Sanity Checks
    ID: infos.request_id,
    category: infos.category,
    total: infos.total,
    notes: infos.notes
  });
  console.log('AJAX DATA INCOMING');
  console.log(req.body);
  res.status(204);
  res.end();
});

function buildFormFormulas(billCount) {
  var out = {
    fieldString: '',
    sumString: "total.value=(totalOut.value=Math.round((0.000001"
  };
  for (var i = 1; i <= (billCount); i++) {
    out.sumString += "+parseFloat(value"+(i)+".value)";
    out.fieldString += "value"+(i);
  }
  out.sumString += ")*100)/100)";
  return out;
}

module.exports = router;