var express = require('express');
var session = require('express-session')
var mongoose = require("mongoose");
var bodyParser = require('body-parser')

require('./models/user.js');
var User = mongoose.model('User');

var app = express();
app.use(session({ secret: '1234567890QWERTY' }));

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

//voir https://github.com/kylepixel/cas-authentication pour fonctionnement
var CASAuthentication = require('cas-authentication');

var cas = new CASAuthentication({
    cas_url     : 'https://cas.usherbrooke.ca/',
    service_url : 'http://localhost:8080'
});

// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
app.get('/app', cas.bounce, function (req, res) {
    res.send('<html><body>Hello!</body></html>');
});

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
app.get('/api', cas.block, function (req, res) {
    res.json({ success: true });
});

// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
app.get('/api/user', cas.block, function (req, res) {
    res.json({ cas_user: req.session[ cas.session_name ] });
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get('/authenticate', cas.bounce_redirect);

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
app.get('/logout', cas.logout);
