require('../models/bandana.js');
var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var mongoose = require("mongoose");
var TagType = mongoose.model('TagType');
var _ = require('underscore');

router.get('/bandana/commande', bounce, function (req, res) {
  res.render('commandeBandana');
});

router.get('/bandana/edit/type', allow_bandana, function(req, res) {
  TagType.find({}, function(err, dbTags) {
    if (err) throw err;

    res.render('editTagTypes', { tags: JSON.stringify(dbTags) });
  });
});

router.post('/bandana/edit/type', allow_bandana, function (req, res) {
  TagType.count({}, function(err, count) {
    if (err) throw err;

    var tagType = new TagType({
      name: 'new Tag Type' + count,
      defaultprice: 1,
      pricedescription: 'Description',
      tags: []
    });

    tagType.save(function (err) {
      handleSaveNewType(err, 0, tagType, function() {
        res.send(JSON.stringify(tagType));
      });
    });
  });
});

router.put('/bandana/edit/type', allow_bandana, function (req, res) {
  var type = req.body;
  TagType.findOne({ name: type.oldName }, function(err, tag) {
    if (err) throw err;

    if (tag) {
      tag.name = type.newType.name;
      tag.defaultprice = type.newType.defaultprice;
      tag.pricedescription = type.newType.pricedescription;

      tag.save(function(err) {
        if (err) throw err;

        res.send(JSON.stringify(tag));
      });
    }
  });
});

router.delete('/bandana/edit/type', allow_bandana, function (req, res) {
  var name = req.body.name;
  TagType.findOne({ name: name }, function (err, tag) {
    if (err) throw err;

    if (tag) {
      tag.remove();
      res.send(name);
    } else {
      res.status(400);
      res.send(name + ' not found');
    }
  });
});

function handleSaveNewType(err, idx, tagType, callback) {
  if (err && err.code == 11000) {
    var newId = idx + 9000;
    tagType.name = 'new Tag Type' + newId;
    tagType.save(function(err) {
      handleSaveNewType(err, newId, tagType, callback);
    });
  } else if (err) {
    throw err;
  } else {
    callback();
  }
}

module.exports = router;