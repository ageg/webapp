var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var auth = require('./module/auth'); //Module use for all authentification on server


require('./models/user.js');
var User = mongoose.model('User');

var app = express();

//require to allow session variables, used for authentification
var session = require('express-session')
app.use(session({ secret: '123456789QWERTY' }));

//required to parse post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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



// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
app.get('/login', auth.bounce, function (req, res) {
    res.redirect('/');
});

app.get('/firstLogin', auth.bounceWOCheck, function (req, res) {
    User.findOne({ cip: req.session[ auth.userName ] }, function (err, obj) {
        if (!obj) {
            res.json({ succes: 'hello' }); //If the user is in our database, make sure he is in it
        }
        else {
            res.redirect('/'); //If the user is in our database, he can't acces this page
        }
    })
});

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
app.get('/api', auth.block, function (req, res) {
    res.json({ success: true });
});

// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
app.get('/api/user', auth.block, function (req, res) {
    res.json({ cas_user: req.session[ auth.userName ] });
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get('/authenticate', auth.bounceRedirect);

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
app.get('/logout', auth.logout);
