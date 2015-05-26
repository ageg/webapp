require('../models/refunds.js');
var auth = require('../modules/auth'); // Module use for all authentification on server
var config = require('../config/config');
var express = require('express');
var mongoose = require("mongoose");
var multer = require('multer');
var Request = mongoose.model('Request');
var router = express.Router();

var refundStatus = {
  WORK_IN_PROGRESS: 0,
  SUBMITTED: 1,
  APPROVED: 2,
  REFUSED: 3,
  PARTIAL: 4
};

Object.freeze(refundStatus);

router.get('/refunds', auth.bounce, function(req, res) {
  if (typeof(req.session.userInfo) === undefined) {
    // Fix that with some nicer function that redirects here
    redirect('/login');
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

router.post('/refunds', [ multer({dest: config.refundOptions.uploaddir}), function(req, res) {
  // User hit the submit button, or, well, nice hack!
  var infos = req.body;
  var request = new Request({
    // TODO: Sanity Checks
    ID: infos.request_id,
    category: infos.category,
    total: infos.total,
    notes: infos.notes
  });
  var needBounce = (typeof(req.session.userInfo) === undefined);
  if (needBounce) {
    // User session got dropped, save his data, bounce him back, then complete the actions
    request.cip = infos.cip;
    request.status = refundStatus.WORK_IN_PROGRESS;
  } else {
    request.cip = req.session.userInfo.cip;
    request.prenom = req.session.userInfo.prenom;
    request.nom = req.session.userInfo.nom;
    request.email = req.session.userInfo.email;
    request.status = refundStatus.SUBMITTED;
  }
  console.log(infos);
  console.log(req.files);
  
  if (request.ID === 0) {
    // Save the request
    request.save(function(err){
      if (err) throw err;
      if (needBounce) {
        auth.bounce();
      } else {
        // TODO: Post-submit actions, like emails & fun
        res.render('refunds',{
          formulas: buildFormFormulas(request.billCount),
          reqInfo : request
        });
      }
    });
  } else {
    // TODO: UPDATE instead of Save
    request.save(function(err){
      if (err) throw err;
        if (needBounce) {
          auth.bounce();
        } else {
          // TODO: Post-submit actions, like emails & fun
          res.render('refunds',{
            formulas: buildFormFormulas(request.billCount),
              reqInfo : request
          });
        }
    });
  }
}]);

router.get('/refunds/uploads', function(req, res) {
  console.log(req);
  res.status(200);
  res.send();
});

router.post('/refunds/uploads',[ multer({dest: config.refundOptions.uploaddir}), function(req, res) {
  console.log(req);
  res.status(200);
  res.end();
}]);

router.post('/refunds/request/update', function(req, res) {
  var infos = req.body;
  var request = new Request({
    // TODO: Session checks
    cip: req.session.userInfo.cip,
    prenom: req.session.userInfo.prenom,
    nom: req.session.userInfo.nom,
    email: req.session.userInfo.email,
    // TODO: Sanity Checks
    ID: infos.request_id,
    category: infos.category,
    total: infos.total,
    notes: infos.notes,
    status: refundStatus.WORK_IN_PROGRESS
  });
  if (request.ID === 0) {
    request.save(function(err){
      if (err) {
        throw err;
      } else {
        //console.log(request._id);
      }
    });
    // TODO: Assign requestID and return it to the client
    res.status(202);
    res.end();
  } else {
    // TODO: Fix for data update
    request.save(function(err){
      if (err) throw err;
    });
    res.status(202);
    res.end();
  }
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

/* As per RFC 2324 */
router.get('/coffee',function(req, res) {
  res.sendStatus(418);
});

module.exports = router;