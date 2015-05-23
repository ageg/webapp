require('../models/bandana.js');
var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
var mongoose = require("mongoose");
var TagType = mongoose.model('TagType');
var Tag = mongoose.model('Tag');
var TagEdition = mongoose.model('TagEdition');
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

router.get('/bandana/edit/tag', allow_bandana, function(req, res) {
  var typeId = req.query.typeid;
  TagType.findOne({ _id: typeId }, function(err, type) {
    if (err) throw err;
    
    if (type) {
      Tag.find({ _id: { $in: type.tags } }, function (err, tagList) {
        if (err) throw err;

        res.render('editTags', { tags: JSON.stringify(tagList) });
      });
    } else {
      res.status(404);
      res.send('TagType not found');
    }
  });
});

router.post('/bandana/edit/tag', allow_bandana, function (req, res) {
  var typeId = req.query.typeid;
  TagType.findOne({ _id: typeId }, function (err, type) {
    if (err) throw err;
    
    if (type) {
      var tag = new Tag({
        name: "new Tag",
        price: 0
      });

      tag.save(function(err) {
        if (err) throw err;
        
        type.tags.push(tag._id);
        type.save(function(err) {
          if (err) throw err;

          res.send(JSON.stringify(tag));
        });
      });
    } else {
      res.status(404);
      res.send('TagType not found');
    }
  });
});

router.delete('/bandana/edit/tag', allow_bandana, function (req, res) {
  var typeId = req.query.typeid;
  var tagId = req.body._id;
  TagType.findOne({ _id: typeId }, function (err, type) {
    if (err) throw err;

    if (type) {
      
    }
  });
});

module.exports = router;