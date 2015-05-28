require('../models/refunds.js');
var auth = require('../modules/auth'); // Module use for all authentification on server
var config = require('../config/config');
var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var mongoose = require("mongoose");
var multer = require('multer');
var Request = mongoose.model('Request');
var router = express.Router();
var url = require('url');

var refundStatus = {
  WORK_IN_PROGRESS: 0,
  SUBMITTED: 1,
  APPROVED: 2,
  REFUSED: 3,
  PARTIAL: 4
};

Object.freeze(refundStatus);

router.get('/refunds', auth.bounce, function(req, res) {
  if (typeof(req.session.userInfo) === 'undefined') {
    // Fix that with some nicer function that redirects here
    res.redirect('/login');
  } else {
    res.redirect('/refunds/menu');
  }
});

router.get('/refunds/menu', auth.bounce, function(req, res) {
  if (typeof(req.session.userInfo) === 'undefined') {
    // Fix that with some nicer function that redirects here
    res.redirect('/login');
  } else {
    var list = new Request();
    list.listAll({'cip': req.session.userInfo.cip}, function (err, entries){
      console.log(entries);
    });
    res.render('refunds/menu');
  }
});

router.get('/refunds/request', auth.bounce, function(req, res) {
  if (typeof(req.session.userInfo) === 'undefined') {
    // TODO: Fix that with some nicer function that redirects here
    res.redirect('/login');
  } else {
    // Fetch request from archives if need be
    // TODO: Actual fetching instead of automatic seeding

    // NEW request
    if (config.devOverride) {
      var request = new Request({
        cip: 'devo0001',
        prenom: 'test',
        nom: 'session',
        email: 'test@example.com',
        ID: 0, // TODO: ID-Assignation routines
        billCount: 1,
        category: '',
        total: 0,
        notes: ''
      });
    } else {
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
    }
    res.render("refunds", {
      formulas: buildFormFormulas(request.billCount),
      reqInfo : request
    });
  }
});

router.post('/refunds/request', [ multer({dest: config.refundOptions.uploadDir}), function(req, res) {
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

router.get('/refunds/uploads/:fileName', function(req, res) {
  /***
   * Fake Static Route
   * Uploads files on demand, or returns a 404
   ***/
  if (typeof(req.session.userInfo) === 'undefined') {
    // Unauthenticated user, will not serve the request
    res.sendStatus(401);
  } else {
    var filePath = 'uploads/'+req.params.fileName;
    fs.exists(filePath, function(exists){
      if (exists) {
        // File Exists
        res.status(200);
        res.send(fs.readFileSync(filePath));
      } else {
        // 404: File Not Found
        res.sendStatus(404);
      }
    });
  }
});

router.post('/refunds/uploads', function(req, res) {
  /***
   * TODO: Reconfigure as communication route for the PUT Method
   ***/
  console.log(req.body);
  res.status(200);
  res.end();
});

router.put('/refunds/uploads', function(req,res) {
  /***
   * Using HTTP Method PUT to upload the file, to keep POST clean
   * (PUT is also OK to reply with a 201)
   **/
  
  if (config.devOptions.verboseDebug) {
    console.log(req.headers);
  }
  
  if (typeof req.session.userInfo === 'undefined') {
    res.sendStatus(401);
    return;
  }
  
  var fileName = req.headers['x-file-name'];
  if (!fileName) {
    res.status(400);
    res.send(JSON.stringify({error: "No name specified."}));
    return;
  }
  var size = parseInt(req.headers['content-length'], 10);
  if (!size || size < 0) {
    res.status(400);
    res.send(JSON.stringify({error: "No size specified."}));
    return;
  }
  
  // TODO: Create renamed file
  var filePath = config.refundOptions.uploadDir+'/'+buildUploadedFileName(req.session.userInfo, fileName);
  var file = fs.createWriteStream(filePath, {
    flags: 'w',
    encoding: 'binary',
    mode: 0644
  });
  
  var hash = crypto.createHash('sha512').setEncoding('hex');
  
  req.on('data', function(chunk) {
    file.write(chunk);
    hash.write(chunk);
    // TODO: measure elapsed time to help ward off attacks?
  });
  
  req.on('end', function() {
    file.end();
    hash.end();
    var md = hash.read();
    if (md.toLowerCase().localeCompare(req.headers['x-file-sha512sum'].toLowerCase()) === 0) {
      res.status(201); // Reply the file was created!
      res.send(JSON.stringify({
        fileName: filePath,
        fileHash: md,
        success: true
      }));
    } else {
      // Hash compare failed, request reupload
      res.status(400);
      res.send(JSON.stringify({
        fileName: fileName,
        fileHash: md,
        success: false
      }));
      // TODO: remove old file
    }
  });
});

router.post('/refunds/request/update', function(req, res) {
  var infos = req.body;
  console.log(infos);
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

function buildUploadedFileName(userInfo, fileName) {
  // TODO: get automatic file ID
  var newName = getSessionCode()+'-Facture'+'-001-' + userInfo.prenom.charAt(0).toUpperCase() + userInfo.nom.charAt(0).toUpperCase();
  // Get file extension
  var pos = fileName.lastIndexOf('.');
  var ext = '';
  if (pos > 0) {
    ext = fileName.slice(pos+1, fileName.length);
    newName += '.'+ext;
  }
  return newName;
}

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

function getSessionCode() {
  // Returns standardized session code string
  var now = new Date();
  var year = now.getFullYear() - 2000;
  var month = now.getMonth();
  var str = '';
  switch(month) {
    case 0:
    case 1:
    case 2:
    case 3:
      str = "H"+year;
      break;
    case 4:
    case 5:
    case 6:
    case 7:
      str = "E"+year;
      break;
    case 8:
    case 9:
    case 10:
    case 11:
      str = "A"+year;
      break;
  }
  return str;
}

/* As per RFC 2324 */
router.get('/coffee',function(req, res) {
  res.sendStatus(418);
});

module.exports = router;