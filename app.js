var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser')

require('./models/user.js');
var User = mongoose.model('User');

var app = express();

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  app.get('/', function (req, res) {
    var gab = new User({
      cip: 'aaaa0000',
      prenom: 'Gab',
      nom: 'Test',
      promo: 00,
      concentration: 'Info'
    });

    gab.save(function(err) {
      if (err) throw err;

      User.findOne({cip: 'aaaa0000'}, function(err,obj) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Hello world ' + obj.name() + ' promo ' + obj.promo, 'utf-8');
      });
    });
  });

  var port = 8080;
  var server = app.listen(port, function () {
    var host = server.address().address;
    console.log('App listening at http://%s:%s', host, port);
  });
});

mongoose.connect('mongodb://localhost/ageg');
