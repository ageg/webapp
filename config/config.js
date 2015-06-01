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
    concentration: /^((?:Biotechnologique|Chimique|Civil|Électronique|Informatique|Mécanique))$/i,
    email: /^([\w\d\.]+\@(?:usherbrooke.ca|ageg.ca))$/i,
    name: /^((?!\d)[\w-'\ ]+)$/i,
    phone: /^([\d]?[\(\ \-]?[\d]{3}[\)\ \-]?[\d]{3}[\ \-]?[\d]{4})$/,
    promo: /^(\d{2,})$/,
    uname: /^((?!\d{2}\s?\d{3}\s?\d{3}|\w{4}\d{4}))$/i
  },
  htmlRegExes: {
    // Same expressions as the regular regExes, but without the enclosing brackets
    email: "^([\\w\\d\\.]+\\@(?:usherbrooke.ca|ageg.ca))$",
    name: "^([\\w-'\\ ]+(?\<!\\d))$",
    phone: "^([\\d]?[\\(\\ \\-]?[\\d]{3}[\\)\\ \\-]?[\\d]{3}[\\ \\-]?[\\d]{4})$",
    uname: "^((?!\\d{2}\\s?\\d{3}\\s?\\d{3}|\\w{4}\\d{4})\\w+)$"
  }
};

config.ONE_YEAR = 31536000000; // seconds

module.exports = config;