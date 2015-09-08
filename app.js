var config = require('./config/config');
var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var https = require('https'); // use HTTPS Server
var auth = require('./modules/auth'); // Module use for all authentification on server
var User = mongoose.model('User');

var app = express();
app.use(express.static(__dirname + '/public'));

// Require to allow session variables, used for authentification
var session = require('express-session');
app.use(session(config.session));

// Required to parse post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/users.js'));
app.use('/', require('./routes/admin.js'));

app.use(function (req, res) {
  res.sendFile(__dirname + '/Public/index.html');
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(500);
  res.json({ error: err.message });
});

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