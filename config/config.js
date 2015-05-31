var config = {};
var fs = require('fs');

config.ssloptions = {
  key: fs.readFileSync('./config/server.key'),
  cert: fs.readFileSync('./config/server.crt'),
  ciphers: 'EECDH EDH AESGCM HIGH !aNULL !eNULL !3DES !DES !DSS !EXP !IDEA !LOW !MD5 !PSK !RC4 !SRP',
  honorCipherOrder: true
};

config.session = {
	cookie: {expires: false}, // Drops session cookie when user agent timeouts
	resave: false, // disables automatic session resave
	saveUninitialized: false, // disables saving uninitialized sessions
	secret: '38Dv60Yi50s0QW5hv6slvRHk4RmYZoqkU0PedB96'
};

config.standards = {
  regExes: {
    email: /^([\w\d\.]+\@(?:usherbrooke.ca|ageg.ca))$/i,
    name: /^([\w-'\ ]+)$/i,
    phone: /^([\d]?[\(\ \-]?[\d]{3}[\)\ \-]?[\d]{3}[\ \-]?[\d]{4})$/,
    uname: /^((?:\d{2}\s?\d{3}\s?\d{3}|\w{4}\d{4}))$/i
  }
};

config.ONE_YEAR = 31536000000; // seconds

module.exports = config;