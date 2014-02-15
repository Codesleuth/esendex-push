var util = require("util"),
    events = require("events"),
    xml2js = require("xml2js");

var PushHandler = function () {
    this.xmlparser = new xml2js.Parser();
};
util.inherits(PushHandler, events.EventEmitter);
PushHandler.prototype.parseRequest = function (request, callback) {
    var $this = this;

    var data = "";
    request.on("data", function(chunk) {
        data += chunk;
    });
    
    request.on("end", function() {
        try {
            $this.xmlparser.parseString(data, function (err, result) {
                if (err === null)
                    callback(result);
            });
        } catch (e) {
            
        }
    });
};
PushHandler.prototype.inbound = function (request) {
    var $this = this;
    this.parseRequest(request, function (result) {
        $this.emit('inbound', result);
    });
    return this;
};
PushHandler.prototype.delivered = function (request) {
    var $this = this;
    this.parseRequest(request, function (result) {
        $this.emit('delivered', result);
    });
    return this;
};
PushHandler.prototype.failure = function (request) {
    var $this = this;
    this.parseRequest(request, function (result) {
        $this.emit('failure', result);
    });
    return this;
};

module.exports = PushHandler;