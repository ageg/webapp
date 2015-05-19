var express = require('express');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var http = require("http");
var ejsLayouts = require("express-ejs-layouts");
var auth = require('./modules/auth'); // Module use for all authentification on server
var User = mongoose.model('User');

var app = express();
app.set("port", 8080);
app.use(express.static(__dirname + '/public'));

// Set view engine and defaut layout
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.set("views","./views");

// Require to allow session variables, used for authentification
var session = require('express-session');
app.use(session({ secret: '123456789QWERTY' }));

// Required to parse post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to send user info to layout
app.use(function (req, res, next) {
    var cip = req.session[ auth.cas.session_name ];
    User.findOne({ cip: cip }, function (err, obj) {
        if (obj) {
            res.locals.userInfo = obj;
        }

        next();
    });
});

// Routes
var index = require("./routes/index.js");
app.get('/', index);

app.get('/login', auth.bounce, function (req, res) {
    res.redirect('/');
});

var add_user = require("./routes/add_user.js");
app.post('/addUser', add_user);

app.use('/', require('./routes/admin.js'));

// Start the server after the db connection
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    console.log('App listening at http://%s:%s', host, app.get("port"));
  });
});

mongoose.connect('mongodb://localhost/ageg');