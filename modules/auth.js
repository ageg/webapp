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

var cas = new CASAuthentication({
  cas_url     : 'https://cas.usherbrooke.ca',
  service_url : 'https://localhost:' + ('8443')
});

checkIfUserExist = function (req, res, next) {
  if (!req.session.userInfo) {
    var cip = req.session[cas.session_name];
    User.findOne({ cip: cip }, function (err, obj) {
      if (!obj) {
        res.render("addUser", { cip: cip });
      } else {
        req.session.userInfo = obj;
        next();
      }
    });
  } else {
    next();
  }
}

allow = function (rights) {
  return function (req, res, next) {
    userRights = req.session.userInfo.rights;
    var userAllowed = false
    userRights.forEach(function(userRight) {
      rights.forEach(function(right) {
        if (userRight === right) {
          next();
          userAllowed = true;
        }
      })
    });
    if (!userAllowed) {
      res.redirect('/');
    }
  }
}

bounce = [cas.bounce, checkIfUserExist];

allow_bandana = [cas.bounce, checkIfUserExist, allow(["bandana", "permie", "admin"])];

allow_permie = [cas.bounce, checkIfUserExist, allow(["permie", "admin"])];

allow_admin = [cas.bounce, checkIfUserExist, allow(["admin"])];

block = [cas.block, checkIfUserExist];

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
  cas: cas
}
