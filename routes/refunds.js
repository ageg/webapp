require('../models/refunds.js');
var auth = require('../modules/auth'); // Module use for all authentification on server
var config = require('../config/config');
var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var idRegEx = /\d+/;
var mongoose = require("mongoose");
var Refund = mongoose.model('Refunds');
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

/* * * * * * * * * * * * * * * * * * * * *
 * REST MAP
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
 *    GLOBAL: ERROR 403
 *    SPECIFIC: UPDATE specific entry (Success Reply: 202?)
 * 
 * DELETE:
 *    GLOBAL: ERROR 403
 *    SPECIFIC: DELETE Specific Entry (Success Reply: 204?)
 * 
 * * * * * * * * * * * * * * * * * * * * */

router.get('/refunds', function(req, res) {
  // Client requires the list of refund requests
  // TODO: User & Admin Rights Validation -> Build Mongo Query Conditions
  Refund.find({'cip': req.session['cas_user']}, {
    // Projection : Superficial information regarding the request
    billCount: true,
    category: true,
    cip: true,
    notes: true,
    reference: true,
    refundID: true,
    submit_date: true,
    status: true,
    total: true
  }, function (err, entries) {
    if(err){
      // For Future Use
      throw err;
    }
    res.json(entries);
  });
});

router.get('/refunds/:id', function(req, res) {
  // Client requires a specific document
  if (typeof(req.session['cas_user']) === 'undefined') {
    res.status(401);
    res.send("No Active Session");
  } else {
    // TODO: User & Admin rights Validation -> Build Mongo Query Conditions
    // Assuming local user, not admin
    Refund.find({
      'cip': req.session['cas_user'],
      'refundID': parseInt(req.params.id)
    }, function (err, entry) {
      if (err) {
        throw err;
      }
      if (entry[0]['cip'] == req.session['cas_user']) {
        res.json(entry);
      } else {
        res.status(403);
        res.send("Trying to access a resource you don't have access to.");
        // TODO: Fail2Ban?
      }
    });
  }
});

router.post('/refunds', function(req, res) {
  // Create new entry in DB
  var infos = req.body;
  var refund = new Refund({
    category: infos.category,
    cip: infos.cip,
    total: infos.total,
    notes: infos.notes
  });
  Object.keys(infos.bills).forEach(function(elem) {
    console.log(elem);
  });
  refund.save(function(err, entry) {
    if (err) {
      throw err;
    }
    res.json({
      err: err,
      refund: refund
    });
  });
});

router.post('/refunds/:id', function(req, res) {
  // POST Method is forbidden on a specific entry
  res.status(403);
  res.send('POST Method is forbidden on a specific entry');
});

router.put('/refunds', function(req, res){
  // PUT Method is forbidden on the global array
  res.sendStatus(403);
});

router.put('/refunds/:id', function(req, res) {
  // Client requires a specific document
  if (typeof(req.session['cas_user']) === 'undefined') {
    res.status(401);
    res.send("No Active Session");
  } else {
    // TODO: User AuthZ
    // TODO: Update Specific Entry
  }
});

router.delete('/refunds', function(req, res) {
  // DELETE Method is forbidden on the global array
  res.sendStatus(403);
});

/****
 * UPLOADS TODO!!!
 * POST -> Create New File
 * GET -> Get File (Specific)
 * PUT -> Update File (Specific)
 * DELETE -> Delete File (Specific)
****/

router.get('/refunds', function(req, res) {
  // GET Method is forbidden on files Array
  res.sendStatus(403);
});

router.get('/refunds/uploads/:fileName', function(req, res) {
  /***
   * Fake Static Route
   * Uploads files on demand, or returns a 404
   ***/
  // TODO: Check User has access to the requested file
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
});

router.post('/refunds/uploads', function(req,res) {
  /***
   * Upload New File
   **/
  
  if (config.devOptions.verboseDebug) {
    console.log(req.headers);
  }
  // TODO: Handle User Validation
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

router.post('/refunds/uploads/:id', function(req, res) {
  // POST Method is Forbidden for Uploads
  res.sendStatus(403);
});

router.put('/refunds/uploads', function(req, res) {
  // POST Method is Forbidden for Uploads
  res.sendStatus(403);
});

router.put('/refunds/uploads/:id', function(req, res){
  // TODO: Aser AuthZ
  // TODO: Update a specific file
});

router.delete('/refunds/uploads', function(req, res) {
  // DELETE Method is not authorized on the whole array
  res.sendStatus(403);
});

router.delete('refunds/uploads/:id', function(req, res) {
  // TODO: User AuthZ for requested ID
  // TODO: Delete Specific file
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