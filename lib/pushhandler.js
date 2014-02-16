var util = require("util"),
    events = require("events"),
    RequestParser = require("./requestparser");

function PushHandler() {
    this.requestParser = new RequestParser();
};
util.inherits(PushHandler, events.EventEmitter);

PushHandler.prototype.inbound = function (request) {
    var $this = this;
    this.requestParser.Parse(request, function (result) {
        $this.emit('inbound', result);
    });
    return this;
};
PushHandler.prototype.delivered = function (request) {
    var $this = this;
    this.requestParser.Parse(request, function (result) {
        $this.emit('delivered', result);
    });
    return this;
};
PushHandler.prototype.failure = function (request) {
    var $this = this;
    this.requestParser.Parse(request, function (result) {
        $this.emit('failure', result);
    });
    return this;
};

module.exports = PushHandler;