var sinon = require("sinon"),
	assert = require("assert");

describe("PushHandler", function () {

	describe("Emit Inbound Event", function () {

		var pusher;
		var originalBody;
		var expectedMessage;
		var requestParserMock;
		var emitStub;
		var requestSpy;
		var result;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			pusher = new PushHandler();

			originalBody = "some body";
			expectedMessage = {};

			requestParserMock = pusher.requestParser = { Parse: sinon.stub() };
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			requestParserMock.Parse
							 .callsArgWith(1, expectedMessage, originalBody);

			result = pusher.inbound(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(requestParserMock.Parse, requestSpy);
		});
		
		it('should have emitted the "inbound" message and original body', function () {
			sinon.assert.calledWith(emitStub, "inbound", expectedMessage, originalBody);
		});
		
		it('should have returned itself', function () {
			assert.equal(result, pusher);
		});
	});

	describe("Emit Delivered Event", function () {

		var pusher;
		var originalBody;
		var expectedMessage;
		var requestParserMock;
		var emitStub;
		var requestSpy;
		var result;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			pusher = new PushHandler();

			originalBody = "some body";
			expectedMessage = {};

			requestParserMock = pusher.requestParser = { Parse: sinon.stub() };
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			requestParserMock.Parse
							 .callsArgWith(1, expectedMessage, originalBody);

			result = pusher.delivered(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(requestParserMock.Parse, requestSpy);
		});
		
		it('should have emitted the "delivered" message and original body', function () {
			sinon.assert.calledWith(emitStub, "delivered", expectedMessage, originalBody);
		});
		
		it('should have returned itself', function () {
			assert.equal(result, pusher);
		});
	});

	describe("Emit Failure Event", function () {

		var pusher;
		var originalBody;
		var expectedMessage;
		var requestParserMock;
		var emitStub;
		var requestSpy;
		var result;

		before(function () {
			var PushHandler = require("../lib/pushhandler");
			pusher = new PushHandler();

			originalBody = "some body";
			expectedMessage = {};

			requestParserMock = pusher.requestParser = { Parse: sinon.stub() };
			emitStub = pusher.emit = sinon.stub();
			requestSpy = sinon.spy();

			requestParserMock.Parse
							 .callsArgWith(1, expectedMessage, originalBody);

			result = pusher.failure(requestSpy);
		});

		
		it('should have parsed the request', function () {
			sinon.assert.calledWith(requestParserMock.Parse, requestSpy);
		});
		
		it('should have emitted the "failure" message and original body', function () {
			sinon.assert.calledWith(emitStub, "failure", expectedMessage, originalBody);
		});
		
		it('should have returned itself', function () {
			assert.equal(result, pusher);
		});
	});

});