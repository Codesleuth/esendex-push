var debug = require('debug');
debug.enable('server');
debug.enable('socket:*');

var server = require('./lib/server'),
    serverDebug = debug('server');

var IP = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || 'localhost',
    PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;

server.create().listen(PORT, IP, function () {
  serverDebug('Server started at %s:%s...', IP, PORT);
});