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
  devOverride: false
};

config.refundOptions = {
  uploaddir: './uploads/'
};

config.serverOptions = {
  protocol: serverProtocol.HTTP2,
  port: 8443
};

config.session = {
  cookie: {expires: false}, // Drops session cookie when user agent timeouts
  resave: false, // disables automatic session resave
  saveUninitialized: false, // disables saving uninitialized sessions
  secret: '38Dv60Yi50s0QW5hv6slvRHk4RmYZoqkU0PedB96'
};

config.ssloptions = {
  key: fs.readFileSync('./config/server.key'),
  cert: fs.readFileSync('./config/server.crt'),
  ciphers: 'EECDH EDH AESGCM HIGH !aNULL !eNULL !3DES !DES !DSS !EXP !IDEA !LOW !MD5 !PSK !RC4 !SRP',
  honorCipherOrder: true
};

config.ONE_YEAR = 31536000000; // seconds

module.exports = config;