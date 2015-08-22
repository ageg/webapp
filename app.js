var auth = require('./modules/auth'); // Module use for all authentification on server
var bodyParser = require('body-parser');
var config = require('./config/config');
var ejsLayouts = require("express-ejs-layouts");
var express = require('express');
var https = require('https'); // use HTTPS Server
var mongoose = require("mongoose");
var multer = require("multer");
var upload = multer({dest: 'uploads/'});
var url = require('url'); // URL parsing library
var User = mongoose.model('User');

var app = express();
app.use(express.static(__dirname + '/public'));

// Set view engine and defaut layout
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set("views","./views");

// Require to allow session variables, used for authentification
var session = require('express-session');
app.use(session(config.session));

// Required to parse post request
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '10MB'
}));
app.use(bodyParser.json());

// Middleware to send user info to layout
app.use(function (req, res, next) {
  if (req.session.userInfo) {
    res.locals.userInfo = req.session.userInfo;
  }

  res.locals.adminRights = auth.adminRights;
  next();
});

// Routes
var index = require("./routes/index.js");
app.get('/', index);

app.get('/login', auth.bounce, function (req, res) {
  auth.setSessionUserInfo(req, function() {
    res.redirect('/');
  });
});

app.get('/logout', function (req, res) {
  delete req.session.userInfo;
  delete req.session[auth.userNameSession];
  res.redirect('/');
});

var add_user = require("./routes/add_user.js");
app.post('/addUser', add_user);

app.use('/', require('./routes/add_location.js'));
app.use('/', require('./routes/admin.js'));
app.use('/', require('./routes/bandana.js'));
app.use('/', require('./routes/profile.js'));
app.use('/', require('./routes/refunds.js'));
app.use('/', require('./routes/user.js'));

// Start the server after the db connection
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
	var server = https.createServer(config.ssloptions, app).listen(8443, function(){
		var host = server.address().address;
		console.log('App listening at http://%s:8443', host);
	});
});

mongoose.connect('mongodb://localhost/ageg');