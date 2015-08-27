/*
 * auth.js 
 * Author = Julien Rossignol
 * Date = 17 mai 2015
 * 
 * exposed variables:
 * 
 * userNameSession : contains the name of the session variable in which the userName of the user in store 
 * bounce : Check if the user is logged in or redirect them to the CAS, then check if the user is in our database and redirect them in firstLogin if they are not
 * bounceWOCheck : like bounce, but does not check if user is in our database
 * block : return a 403 error to user not logged in, check if user is in our database and redirect them if they are not
 * blockWOCheck : like block but does not check if user is in our database
 * logout : logout the user from the CAS
 * bounceRedirect : like bounce, but redirect the user to the latest bounce redirection instead of a specified url
 * 
 * See below code for exemple of usage
*/


// See https://github.com/kylepixel/cas-authentication 
var CASAuthentication = require('cas-authentication');

//Load db to acess user data
var mongoose = require("mongoose");
require('../models/user.js');
var config = require('../config/config.js');
var User = mongoose.model('User');

var cas = new CASAuthentication({
  cas_url     : 'https://cas.usherbrooke.ca',
  service_url : 'https://localhost:' + ('8443')
});

allow = function (rights) {
  return function (req, res, next) {
    if (!req.session[cas.session_name]) {
      res.status('403');
      res.json('error: No user logged in!');
      res.end();
    }
    else {
      User.findOne({ cip: req.session[cas.session_name]}, function (err, obj) {
        var userAllowed = false
        obj.rights.forEach(function (userRight) {
          rights.forEach(function (right) {
            if (userRight === right && !userAllowed) {
              userAllowed = true;
              next();
            }
          })
        });
        if (!userAllowed) {
          res.status('403');
          res.json({ error: 'The user doesnt match the required authorizations: ' + JSON.stringify(rights) });
          res.end();
        }
      });
    }
  }
}

bounce = [cas.bounce];

allow_bandana = [allow(["bandana", "permie", "admin"])];

allow_permie = [allow(["permie", "admin"])];

allow_admin = [allow(["admin"])];

block = [cas.block];

module.exports = {
  userNameSession: cas.session_name,
  bounceWOCheck: cas.bounce,
  blockWOCheck: cas.block,
  logout: cas.logout,
  bounce: bounce,
  block: block,
  bounceRedirect: cas.bounce_redirect,
  allow_permie: allow_permie,
  allow_admin: allow_admin,
  cas: cas,
}

/*
 
//Unauthenticated clients will be redirected to the CAS login and then back to
//this route once authenticated. If the user is not in our database, they'll be redirect to firstLogin
app.get('/login', auth.bounce, function (req, res) {
    res.redirect('/');
});

//Unauthenticated clients will be redirected to the CAS login and then back to
//this route once authenticated.
app.get('/firstLogin', auth.bounceWOCheck, function (req, res) {
    res.json({ success: true });
});

//Unauthenticated clients will receive a 401 Unauthorized response instead of
//the JSON data. If the user is not in our database, they'll be redirect to firstLogin
app.get('/api', auth.block, function (req, res) {
    res.json({ success: true });
});

//An example of accessing the CAS user session variable. This could be used to
//retrieve your own local user records based on authenticated CAS username.
app.get('/api/user', auth.block, function (req, res) {
    res.json({ cas_user: req.session[ auth.userName ] });
});

//Unauthenticated clients will be redirected to the CAS login and then to the
//provided "redirectTo" query parameter once authenticated.
app.get('/authenticate', auth.bounceRedirect);

//This route will de-authenticate the client with the Express server and then
//redirect the client to the CAS logout page.
app.get('/logout', auth.logout);

*/