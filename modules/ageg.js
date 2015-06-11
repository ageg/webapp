var adLDAP = require('activedirectory');
var config = require('../config/config.js');

var ad = new adLDAP(config.adLDAP);

exports.authN = function (userName, passWord, callback) {
  if (config.devOverride.ldap) { // Undefined will check as false
    callback(userName, config.devOverride.ldapAuth);
  } else {
    ad.authenticate(userName, passWord, function(err, auth){
      if (err) {
        // TODO Check Auth value on error. Also check Error state on Auth Fail...
        console.log('ERROR: '+JSON.stringify(err));
        auth = false;
      }
      callback(userName, auth);
    });
  }
}