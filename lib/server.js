var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    socketio = require('socket.io'),
    parser = require('./requestparser').create(),
    debug = require('debug');

var serverDebug = debug('server');

function readPush(req, res, callback) {
  if (req.method != 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
    return callback(new Error('Method Not Allowed'));
  }

  parser.Parse(req, function (err, push, xml) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end();
    callback(err, push, xml);
  });
}

function inbound(io, req, res) {
  readPush(req, res, function (err, push, xml) {
    if (err || !push.InboundMessage) return serverDebug('<- 200 /inbound - error processing push');
    serverDebug('<- 200 /inbound - accountid %s', push.InboundMessage.AccountId);
    var m = {
      accountId: push.InboundMessage.AccountId.toLowerCase(),
      push: push.InboundMessage
    };
    io.sockets.in(m.accountId).emit('inbound', m);
  });
}

function delivered(io, req, res) {
  readPush(req, res, function (err, push, xml) {
    if (err || !push.MessageDelivered) return serverDebug('<- 200 /delivered - error processing push');
    serverDebug('<- 200 /delivered - accountid %s', push.MessageDelivered.AccountId);
    var m = {
      accountId: push.MessageDelivered.AccountId.toLowerCase(),
      push: push.MessageDelivered
    };
    io.sockets.in(m.accountId).emit('delivered', m);
  });
}

function failure(io, req, res) {
  readPush(req, res, function (err, push, xml) {
    if (err || !push.MessageFailed) return serverDebug('<- 200 /failure - error processing push');
    serverDebug('<- 200 /failure - accountid %s', push.MessageFailed.AccountId);
    var m = {
      accountId: push.MessageFailed.AccountId.toLowerCase(),
      push: push.MessageFailed
    };
    io.sockets.in(m.accountId).emit('failure', m);
  });
}

function serveFile(filename, contentType, res) {
  var file = path.join(__dirname, '..', 'public', filename);

  res.writeHead(200, { 'Content-Type': contentType });
  var fileStream = fs.createReadStream(file);
  fileStream.pipe(res);

  serverDebug('-> 200 /%s', filename);
}

function Server() {
  var self = this;

  this.server = http.createServer(function (req, res) {
    switch (req.url) {
      case '/inbound': return inbound(self.io, req, res);
      case '/delivered': return delivered(self.io, req, res);
      case '/failure': return failure(self.io, req, res);
    }

    switch (req.url) {
      case '/': return serveFile('index.html', 'text/html', res);
      case '/index.js': return serveFile('index.js', 'text/javascript', res);
      case '/socket.io.js': return serveFile('socket.io-1.1.0.js', 'text/javascript', res);
      case '/style.css': return serveFile('style.css', 'text/css', res);
      default: 
        res.writeHead(404, { 'Content-Type': 'text/plain-text' });
        res.end('Not Found');
        serverDebug('-> 404 %s', req.url);
        break;
    }
  });

  this.io = socketio(this.server);
  this.io.sockets.on('connection', function (socket) {
    socket.debug = debug('socket:' + socket.id);

    socket.debug('connected');

    socket.on('accountid', function (accountid) {
      accountid = accountid.toLowerCase();
      
      if (this.accountid == accountid) return;

      if (this.accountid) {
        this.leave(accountid);
        this.debug('removed accountid %s', this.accountid);
      }
      this.accountid = accountid;
      this.join(accountid);
      this.debug('set accountid %s', this.accountid);
      this.emit('accountid', accountid);
    });

    socket.on('disconnect', function () {
      this.debug('disconnected');
    });
  });
}

Server.prototype.listen = function (port, host, callback) {
  this.server.listen(port, host, function() {
    callback(port, host);
  });
  return this;
};

Server.prototype.close = function () {
  this.io.close();
};

module.exports.create = function () {
  return new Server();
};