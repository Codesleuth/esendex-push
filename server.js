var http = require('http'),
    util = require('util'),
    events = require('events'),
    xml2js = require('xml2js'),
    fs = require("fs"),
    PushHandler = require("./lib/pushhandler");    

var clients = {};
var clientIndex = 0;

function notifyClients(message) {
    for (var key in clients) {
        console.log("Notifying client %s", key);
        
        var client = clients[key];
        client.res.write("data: " + JSON.stringify(message) + "\n\n");
    }
}

var pusher = new PushHandler();
pusher.on('inbound', function (message) {
    console.log("Got 'inbound' with %j", message);
    notifyClients(message);
}).on('delivered', function (message) {
    console.log("Got 'delivered' with %j", message);
    notifyClients(message);
}).on('failure', function (message) {
    console.log("Got 'failure' with %j", message);
    notifyClients(message);
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

    if (req.url == '/listen') {
        
        if (!validateClientRequest(req, res))
            return;
        
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        
        var thisClient = clientIndex;
        clients[thisClient] = { req: req, res: res };
        clientIndex++;
        
        console.log('Client %s connected', thisClient);
        
        res.on('close', function() {
            console.log('Client %s left', thisClient);
            delete clients[thisClient];
        });
		
		return;
    }
	
	if (req.url == '/index.js') {
        
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        var fileStream = fs.createReadStream(__dirname + "/index.js");
        fileStream.pipe(res);
		
		return;
    }
	
	res.writeHead(200, { 'Content-Type': 'text/html' });
	var fileStream = fs.createReadStream(__dirname + "/index.html");
	fileStream.pipe(res);
	
}).listen(PORT, IP, function() {
    console.log("Server started: http://%s:%s", IP, PORT);
});