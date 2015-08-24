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
var User = mongoose.model('User');

// Configuration Values
var config = require('../config/config.js');
var depts = require('../models/depts.js');

adminRights = {
  NONE: 0,
  BANDANA: 1,
  PERMIE: 2,
  ADMIN: 3
}

var cas = new CASAuthentication({
  cas_url     : 'https://cas.usherbrooke.ca',
  service_url : 'https://localhost:8443',
  // Based on a tweaked version of CASAuthentication, pull request is active, should be merged soon.
  session_info: 'cas_userinfo'
});

setSessionUserInfo = function (req, callback) {
  var cip = req.session[cas.session_name];
  User.findOne({ cip: cip }, function (err, obj) {
    if (obj) {
      req.session.userInfo = obj;
    }
    callback();
  });
}

check = function (req, res, next) {
  if (!req.session.userInfo) {
    var cip = req.session[cas.session_name];
    User.findOne({ cip: cip },{
      __v: false,
      _id: false
    }, function (err, obj) {
      if (!obj) {
        // Create new user info from CAS info
        var user = new User({
          cip: req.session.cas_user,
          prenom: req.session.cas_userinfo !== undefined ? req.session.cas_userinfo.prenom : '',
          nom: req.session.cas_userinfo !== undefined ? req.session.cas_userinfo.nomfamille : '',
          email: req.session.cas_userinfo !== undefined ? req.session.cas_userinfo.courriel : '',
          rights: adminRights.NONE,
          ageguname: ''
        });
        user.save(function (err) {
          if (err) throw err;
          setSessionUserInfo(req, function () {
            next();
          });
        });
      } else {
        setSessionUserInfo(req, function () {
          next();
        });
      }
    });
  } else {
    next();
  }
}

allow = function (rights) {
  return function (req, res, next) {
    var cip = req.session[cas.session_name];
    User.findOne({ cip: cip }, function (err, obj) {
      var found = false;
      if (obj) {
        rights.forEach(function (element, index, array) {
          if (obj.rights == element) {
            found = true;
            next();
          }
        });
      }
      
      if (!found) {
        res.status('403');
        res.send('403: Forbidden');
      }
    });
  }
}

bounce = [cas.bounce, check];

allow_bandana = [cas.bounce, check, allow([adminRights.BANDANA, adminRights.PERMIE, adminRights.ADMIN])];

allow_permie = [cas.bounce, check, allow([adminRights.PERMIE, adminRights.ADMIN])];

allow_admin = [cas.bounce, check, allow([adminRights.ADMIN])];

block = [cas.block, check];

module.exports = {
  userNameSession: cas.session_name,
  bounceWOCheck: cas.bounce,
  blockWOCheck: cas.block,
  logout: cas.logout,
  bounce: bounce,
  block: block,
  bounceRedirect: cas.bounce_redirect,
  adminRights: adminRights,
  allow_permie: allow_permie,
  allow_admin: allow_admin,
  cas: cas,
  setSessionUserInfo: setSessionUserInfo
}