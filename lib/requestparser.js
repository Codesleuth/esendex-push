function RequestParser(xmlparser) {
	this.xmlparser = xmlparser || new (require('xml2js')).Parser();
}

RequestParser.prototype.Parse = function (request, callback) {
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
}

module.exports = RequestParser;