var http = require('http'),
    util = require('util'),
    events = require('events'),
    xml2js = require('xml2js'),
    fs = require("fs"),
    PushHandler = require("./lib/pushhandler"),
    ClientList = require('./lib/clientlist');



function getClientAddress(client) {
    if (client.name === undefined) {
        client.name = (client.req.headers['x-forwarded-for'] || '').split(',')[0] || client.req.connection.remoteAddress;
    }
    return client.name;
};

var clients = new ClientList();

var notifier = new events.EventEmitter();
notifier.on("notify", function (message) {
    clients.each(function (client) {
        if (client.accountId == message.accountId) {
            console.log("Notifying client '%s'", getClientAddress(client));
            client.res.write("data: " + JSON.stringify(message) + "\n\n");
        }
    });
})
.on("connected", function (client) {
    client.res.write("data: " + JSON.stringify({"event": "connect", "accountId": client.accountId}) + "\n\n");
});

var pusher = new PushHandler();
pusher.on('inbound', function (message, body) {
    console.log("Got 'inbound' push for AccountId '%s'", message.InboundMessage.AccountId);
    var m = {
        type: "inbound", 
        when: new Date().getTime(), 
        accountId: message.InboundMessage.AccountId,
        message: message, 
        body: body
    };
    notifier.emit("notify", m);
}).on('delivered', function (message, body) {
    console.log("Got 'delivered' push for AccountId '%s'", message.MessageDelivered.AccountId);
    var m = {
        type: "delivered", 
        when: new Date().getTime(), 
        accountId: message.MessageDelivered.AccountId,
        message: message, 
        body: body
    };
    notifier.emit("notify", m);
}).on('failure', function (message, body) {
    console.log("Got 'failure' push for AccountId '%s'", message.MessageFailed.AccountId);
    var m = {
        type: "failure", 
        when: new Date().getTime(), 
        accountId: message.MessageFailed.AccountId,
        message: message, 
        body: body
    };
    notifier.emit("notify", m);
});

function validatePushRequest(req, res) {
    if (req.method != "POST") {
        res.writeHead(405, { 'Content-Type': 'text/plain-text' });
        res.end("Method not allowed");
        return false;
    }
    return true;
}

function validateClientRequest(req, res) {
    if (req.method != "GET") {
        res.writeHead(405, { 'Content-Type': 'text/plain-text' });
        res.end("Method not allowed");
        return false;
    }
    return true;
}




var IP = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1',
    PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;

var listenRegex = /\/listen\/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/;

http.createServer(function(req, res) {
    
    if (req.url == '/inbound') {
        
        if (!validatePushRequest(req, res))
            return;
        
        pusher.inbound(req);
        
        res.writeHead(200, { 'Content-Type': 'text/plain-text' });
        res.end();
		
		return;
    }
    
    if (req.url == '/delivered') {
        
        if (!validatePushRequest(req, res))
            return;
        
        pusher.delivered(req);
        
        res.writeHead(200, { 'Content-Type': 'text/plain-text' });
        res.end();
		
		return;
    }
    
    if (req.url == '/failure') {
        
        if (!validatePushRequest(req, res))
            return;
        
        pusher.failure(req);
        
        res.writeHead(200, { 'Content-Type': 'text/plain-text' });
        res.end();
		
		return;
    }

    var match = listenRegex.exec(req.url);
    if (match != null) {
        
        if (!validateClientRequest(req, res))
            return;
        
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        
        var client = clients.add(req, res);
        client.accountId = match[1].toLowerCase();

        console.log("Client '%s' connected with AccountID '%s'", getClientAddress(client), client.accountId);
        
        res.on('close', function() {
            clients.remove(client);
            console.log("Client '%s' disconnected with AccountID '%s'", getClientAddress(client), client.accountId);
        });

        notifier.emit('connected', client);
		
		return;
    }
	
	if (req.url == '/index.js') {
        
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        var fileStream = fs.createReadStream(__dirname + "/index.js");
        fileStream.pipe(res);
		
		return;
    }
    
    if (req.url == '/') {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var fileStream = fs.createReadStream(__dirname + "/index.html");
        fileStream.pipe(res);
        
        return;
    }
	
	res.writeHead(404, { 'Content-Type': 'text/plain-text' });
	res.end("Not Found");
	
}).listen(PORT, IP, function() {
    console.log("Server started: http://%s:%s", IP, PORT);
});