var sinon = require("sinon"),
	assert = require("assert");

describe("PushHandler", function () {

	describe("Emit Inbound Event", function () {

		var pusher;
		var expectedMessage;
		var requestParserMock;
		var emitStub;
		var requestSpy;
		var result;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			pusher = new PushHandler();

			expectedMessage = {};

			requestParserMock = pusher.requestParser = { Parse: sinon.stub() };
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			requestParserMock.Parse
							 .callsArgWith(1, expectedMessage);

			result = pusher.inbound(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(requestParserMock.Parse, requestSpy);
		});
		
		it('should have emitted the inbound event', function () {
			sinon.assert.calledWith(emitStub, "inbound", expectedMessage);
		});
		
		it('should have returned itself', function () {
			assert(result, pusher);
		});
	});

	describe("Emit Delivered Event", function () {

		var pusher;
		var expectedMessage;
		var requestParserMock;
		var emitStub;
		var requestSpy;
		var result;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			pusher = new PushHandler();

			expectedMessage = {};

			requestParserMock = pusher.requestParser = { Parse: sinon.stub() };
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			requestParserMock.Parse
							 .callsArgWith(1, expectedMessage);

			result = pusher.delivered(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(requestParserMock.Parse, requestSpy);
		});
		
		it('should have emitted the inbound event', function () {
			sinon.assert.calledWith(emitStub, "delivered", expectedMessage);
		});
		
		it('should have returned itself', function () {
			assert(result, pusher);
		});
	});

	describe("Emit Failure Event", function () {

		var pusher;
		var expectedMessage;
		var requestParserMock;
		var emitStub;
		var requestSpy;
		var result;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			pusher = new PushHandler();

			expectedMessage = {};

			requestParserMock = pusher.requestParser = { Parse: sinon.stub() };
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			requestParserMock.Parse
							 .callsArgWith(1, expectedMessage);

			result = pusher.failure(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(requestParserMock.Parse, requestSpy);
		});
		
		it('should have emitted the inbound event', function () {
			sinon.assert.calledWith(emitStub, "failure", expectedMessage);
		});
		
		it('should have returned itself', function () {
			assert(result, pusher);
		});
	});

});