var sinon = require("sinon"),
    assert = require("assert"),
    proxyquire = require('proxyquire');

describe("RequestParser", function () {

  describe("Parse with valid XML body", function () {

    var requestStub;
    var expectedData;
    var expectedParsedResult;
    var parseStringStub;
    var parserStub;
    var callbackSpy;

    before(function () {
      expectedData = "some xml";
      expectedParsedResult = "some parsed result";

      parseStringStub = sinon.stub().callsArgWith(1, null, expectedParsedResult);
      parserStub = sinon.stub().returns({ parseString: parseStringStub });

      requestStub = { on: sinon.stub() };

      requestStub.on
        .withArgs("data", sinon.match.func)
        .callsArgWith(1, expectedData);

      requestStub.on
        .withArgs("end", sinon.match.func)
        .callsArg(1);

      callbackSpy = sinon.spy();

      var RequestParser = proxyquire("../lib/requestparser", { 'xml2js': { Parser: parserStub } });
      RequestParser.create().Parse(requestStub, callbackSpy);
    });

    
    it('should listen to the "data" event on the request', function () {
      sinon.assert.calledWith(requestStub.on, "data", sinon.match.func);
    });

    it('should listen to the "end" event on the request', function () {
      sinon.assert.calledWith(requestStub.on, "end", sinon.match.func);
    });

    it('should parse the request body', function () {
      sinon.assert.calledWith(parseStringStub, expectedData, sinon.match.func);
    });

    it('should have called the callback with the expected parsed message and raw data', function () {
      sinon.assert.calledWith(callbackSpy, null, expectedParsedResult, expectedData);
    });

  });

  describe("Parse with invalid XML body", function () {

    var expectedData;
    var parseStringError;
    var callbackSpy;

    before(function () {
      expectedData = "some xml";
      parseStringError = new Error('some error');

      var parseStringStub = sinon.stub().callsArgWith(1, parseStringError, null);
      var parserStub = sinon.stub().returns({ parseString: parseStringStub });

      var requestStub = { on: sinon.stub() };

      requestStub.on
        .withArgs("data", sinon.match.func)
        .callsArgWith(1, expectedData);

      requestStub.on
        .withArgs("end", sinon.match.func)
        .callsArg(1);

      callbackSpy = sinon.spy();

      var RequestParser = proxyquire("../lib/requestparser", { 'xml2js': { Parser: parserStub } });
      RequestParser.create().Parse(requestStub, callbackSpy);
    });

    it('should have called the callback with the error, null parsed message and raw data', function () {
      sinon.assert.calledWith(callbackSpy, parseStringError, null, expectedData);
    });

  });

});