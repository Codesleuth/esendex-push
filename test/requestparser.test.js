var sinon = require("sinon"),
	assert = require("assert");

describe("RequestParser", function () {

	describe("Parse with valid XML body", function () {

		var xml2jsMock;
		var requestStub;
		var result;
		var expectedData;
		var expectedParsedMessage;

		before(function () {

			expectedData = "some xml";
			expectedParsedMessage = "some message";

			xml2jsMock = { parseString: sinon.stub() };

			var RequestParser = require("../lib/requestparser");
			var parser = new RequestParser(xml2jsMock);

			requestStub = { on: sinon.stub() };

			requestStub.on
					   .withArgs("data", sinon.match.func)
					   .callsArgWith(1, expectedData);

			requestStub.on
					   .withArgs("end", sinon.match.func)
					   .callsArg(1);

			xml2jsMock.parseString
				  	  .withArgs(expectedData, sinon.match.func)
				      .callsArgWith(1, null, expectedParsedMessage);

			parser.Parse(requestStub, function (actualMessage) {
				result = actualMessage;
			});
		});

		
		it('should listen to the "data" event on the request', function () {
			sinon.assert.calledWith(requestStub.on, "data", sinon.match.func);
		});

		it('should listen to the "end" event on the request', function () {
			sinon.assert.calledWith(requestStub.on, "end", sinon.match.func);
		});

		it('should parse the request body', function () {
			sinon.assert.calledWith(xml2jsMock.parseString, expectedData, sinon.match.func);
		});

		it('should have called the callback with the expected parsed message', function () {
			assert(result, expectedParsedMessage);
		});
	});

	describe("Parse with invalid XML body", function () {

		var callbackSpy;

		before(function () {

			var xml2jsMock = { parseString: sinon.stub() };

			var RequestParser = require("../lib/requestparser");
			var parser = new RequestParser(xml2jsMock);

			var requestStub = { on: sinon.stub() };

			requestStub.on
					   .withArgs("data", sinon.match.func)
					   .callsArgWith(1, "some xml");

			requestStub.on
					   .withArgs("end", sinon.match.func)
					   .callsArg(1);

			xml2jsMock.parseString
				  	  .withArgs(sinon.match.string, sinon.match.func)
				      .callsArgWith(1, "not null", undefined);

			callbackSpy = sinon.spy();

			parser.Parse(requestStub, callbackSpy);
		});


		it('should not have called the callback', function () {
			sinon.assert.notCalled(callbackSpy);
		});
	});

	describe("Parse with exception thrown by parser", function () {

		var callbackSpy;

		before(function () {

			var xml2jsMock = { parseString: sinon.stub() };

			var RequestParser = require("../lib/requestparser");
			var parser = new RequestParser(xml2jsMock);

			var requestStub = { on: sinon.stub() };

			requestStub.on
					   .withArgs("data", sinon.match.func)
					   .callsArgWith(1, "some xml");

			requestStub.on
					   .withArgs("end", sinon.match.func)
					   .callsArg(1);

			xml2jsMock.parseString
				  	  .withArgs(sinon.match.string, sinon.match.func)
				      .throws();

			callbackSpy = sinon.spy();

			parser.Parse(requestStub, callbackSpy);
		});


		it('should not have called the callback', function () {
			sinon.assert.notCalled(callbackSpy);
		});
	});
});