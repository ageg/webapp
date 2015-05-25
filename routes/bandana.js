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
  var tagType = new TagType({
    name: 'new Tag Type',
    defaultprice: 1,
    pricedescription: 'Description',
    tags: []
  });

  tagType.save(function (err) {
    if (err) throw err;

    res.send(JSON.stringify(tagType));
  });
});

router.put('/bandana/edit/type', allow_bandana, function (req, res) {
  var type = req.body;
  TagType.findOne({ _id: type._id }, function(err, tag) {
    if (err) throw err;

    if (tag) {
      tag.name = type.name;
      tag.defaultprice = type.defaultprice;
      tag.pricedescription = type.pricedescription;

      tag.save(function(err) {
        if (err) throw err;

        res.send(JSON.stringify(tag));
      });
    }
  });
});

router.delete('/bandana/edit/type', allow_bandana, function (req, res) {
  var id = req.body._id;
  TagType.findOne({ _id: id }, function (err, tag) {
    if (err) throw err;

    if (tag) {
      tag.remove();
      res.send(tag._id);
    } else {
      res.status(400);
      res.send(name + ' not found');
    }
  });
});

module.exports = router;