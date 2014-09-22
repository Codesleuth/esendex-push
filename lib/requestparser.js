var xml2js = require('xml2js');

function RequestParser() {
	this.parseString = xml2js.Parser({explicitArray: false, mergeAttrs: true}).parseString;
}

RequestParser.prototype.Parse = function (req, callback) {
	var $this = this;

  var data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  
  req.on("end", function() {
    $this.parseString(data, function (err, result) {
      callback(err, result, data);
    });
  });
}

module.exports.create = function () {
  return new RequestParser();
};