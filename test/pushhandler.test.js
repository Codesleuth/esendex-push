var sinon = require("sinon");

describe("PushHandler", function () {

	describe("Emit Inbound Event", function () {

		var expectedMessage;
		var parseRequestStub;
		var emitStub;
		var requestSpy;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			var pusher = new PushHandler();

			expectedMessage = {};

			parseRequestStub = pusher.parseRequest = sinon.stub();
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			parseRequestStub.callsArgWith(1, expectedMessage);

			pusher.inbound(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(parseRequestStub, requestSpy);
		});
		
		it('should have emitted the inbound event', function () {
			sinon.assert.calledWith(emitStub, "inbound", expectedMessage);
		});
	});

	describe("Emit Delivered Event", function () {

		var expectedMessage;
		var parseRequestStub;
		var emitStub;
		var requestSpy;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			var pusher = new PushHandler();

			expectedMessage = {};

			parseRequestStub = pusher.parseRequest = sinon.stub();
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			parseRequestStub.callsArgWith(1, expectedMessage);

			pusher.delivered(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(parseRequestStub, requestSpy);
		});
		
		it('should have emitted the delivered event', function () {
			sinon.assert.calledWith(emitStub, "delivered", expectedMessage);
		});
	});

	describe("Emit Failure Event", function () {

		var expectedMessage;
		var parseRequestStub;
		var emitStub;
		var requestSpy;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			var pusher = new PushHandler();

			expectedMessage = {};

			parseRequestStub = pusher.parseRequest = sinon.stub();
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			parseRequestStub.callsArgWith(1, expectedMessage);

			pusher.failure(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(parseRequestStub, requestSpy);
		});
		
		it('should have emitted the failure event', function () {
			sinon.assert.calledWith(emitStub, "failure", expectedMessage);
		});
	});

	describe("Parse Request", function () {

		var requestStub;
		var callbackStub;
		var expectedParsedMessage;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			var pusher = new PushHandler();

			requestStub = { on: sinon.stub() };
			callbackStub = sinon.stub();
			pusher.xmlparser = { parseString: sinon.stub() };
			expectedParsedMessage = {};

			requestStub.on
					   .withArgs("end", sinon.match.func)
					   .callsArg(1);
			pusher.xmlparser
				  .parseString
				  .withArgs(sinon.match.string, sinon.match.func)
				  .callsArgWith(1, null, expectedParsedMessage);

			pusher.parseRequest(requestStub, callbackStub);
		});


		it('should listen to the "data" event on the request', function () {
			sinon.assert.calledWith(requestStub.on, "data", sinon.match.func);
		});

		it('should listen to the "end" event on the request', function () {
			sinon.assert.calledWith(requestStub.on, "end", sinon.match.func);
		});

		it('should have called the callback with the expected parsed message', function () {
			sinon.assert.calledWith(callbackStub, expectedParsedMessage);
		});
	});

});