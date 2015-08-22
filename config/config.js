var config = {};
var fs = require('fs');

// Configure the server protocol to use
var serverProtocol = {
  HTTP: -1,
  HTTPS: 0,
  SPDY: 1, // requires module spdy
  HTTP2: 2 // requires module http2
};

Object.freeze(serverProtocol);

module.exports = serverProtocol;

// To configure development overrides
config.devOptions = {
  devOverride: true,
  verboseDebug: true
};

config.refundOptions = {
  uploadDir: './uploads/'
};

config.serverOptions = {
  protocol: serverProtocol.HTTP2,
  port: 8443
};

config.adLDAP = {
  url: 'ldap://hammond.ageg.ca',
  baseDN: 'ou=utilisateurs,dc=ageg,dc=local',
  username: 'gab@ageg.local',
  password: ''
};

config.devOverride = {
  ldap: true, // Toggles LDAP AuthN override
  ldapAuth: true // Situation to simulate with LDAP AuthN override
};

config.smtps = {
  host: 'smtps.usherbrooke.ca',
  password: 'meh!',
  port: 587,
  tls: true,
  user: 'foug1803'
};

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
    cip: /^([a-z]{4}\d{4})$/i,
    dept: /^((?:Biotechnologique|Chimique|Civil|Électrique|Informatique|Mécanique))$/i,
    email: /^([\w\d\.]+\@(?:usherbrooke.ca|ageg.ca))$/i,
    longText: /^((?:\w?\s?\n?)+)$/i,
    name: /^([a-zA-ZàÀâÂéÉèÈêÊëËôÔïÏçÇ\-\'\ \.]+)$/i,
    number: /^(\d+)$/,
    phone: /^([\d]?[\(\ \-]?[\d]{3}[\)\ \-]?[\d]{3}[\ \-]?[\d]{4})$/,
    promo: /^(\d{2,})$/,
    text: /^((?:\w?\p{Z}?\'?\-?)+)$/i,
    uname: /^((?!\d{2}\s?\d{3}\s?\d{3}|\w{4}\d{4})(?:|ageg\\\w+|\w+\@ageg\.local\.?))$/i
  },
  htmlRegExes: {
    // Same expressions as the regular regExes, but without the enclosing brackets
    cip: "^([a-zA-Z]{4}\\d{4})$",
    dept: "^((?:Biotechnologique|Chimique|Civil|Électrique|Informatique|Mécanique))$",
    email: "^([\\w\\d\\.]+\\@(?:usherbrooke.ca|ageg.ca))$",
    name: "^([a-zA-ZàÀâÂéÉèÈêÊëËôÔïÏçÇ\\-'\\ \\.]+)$",
    phone: "^([\\d]?[\\(\\ \\-]?[\\d]{3}[\\)\\ \\-]?[\\d]{3}[\\ \\-]?[\\d]{4})$",
    promo: "^(\\d{2,})$",
    uname: "^((?!\\d{2}\\s?\\d{3}\\s?\\d{3}|\\w{4}\\d{4})(?:ageg\\\\\\w+|\\w+\@ageg\.local\.?))$"
  }
};

config.ONE_YEAR = 31536000000; // seconds

module.exports = config;