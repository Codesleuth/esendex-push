var sinon = require("sinon"),
	assert = require("assert"),
	util = require("util");

describe("ClientList", function () {

	describe("Add client", function () {

		var client;
		var request, response;
		var count;

		before(function () {

			var ClientList = require('../lib/clientlist');
			var clientList = new ClientList();

			request = "add request";
			response = "add response";

			client = clientList.add(request, response);
			count = clientList.count();
		});

		it('should return the client object', function () {
			assert.equal(client.req, request);
			assert.equal(client.res, response);
		});

		it('should have count() equal to one', function () {
			assert.equal(count, 1);
		});

	});

	describe("Remove client", function () {

		var client;
		var request, response;
		var countBeforeRemove, count;

		before(function () {

			var ClientList = require('../lib/clientlist');
			var clientList = new ClientList();

			request = "remove request";
			response = "remove response";

			client = clientList.add(request, response);
			countBeforeRemove = clientList.count();
			clientList.remove(client);
			count = clientList.count();
		});

		it('should return the client object', function () {
			assert.equal(client.req, request);
			assert.equal(client.res, response);
		});

		it('should have count() one before removing', function () {
			assert.equal(countBeforeRemove, 1);
		});

		it('should have count() zero after removing', function () {
			assert.equal(count, 0);
		});

	});

	describe("Count clients", function () {

		var randomClients;
		var countBeforeRemove, count;

		before(function () {

			var ClientList = require('../lib/clientlist');
			var clientList = new ClientList();

			randomClients = Math.floor(Math.random() * 100) + 1;

			for (var i = 0; i < randomClients; i++) {
				clientList.add("request#" + i, "response#" + i);
			}

			count = clientList.count();
		});

		it('should have count() of the number of clients added', function () {
			assert.equal(count, randomClients);
		});

	});

	describe("Each enumerator", function () {

		var callbackSpy;

		before(function () {

			var ClientList = require('../lib/clientlist');
			var clientList = new ClientList();

			callbackSpy = sinon.spy();

			clientList.add("asda", "asdaddsa");
			clientList.add("bvsnbas", "sdhfjs");

			clientList.each(callbackSpy);
		});

		it('should have callbacks twice', function () {
			assert(callbackSpy.calledTwice);
		});

	});

	describe("Each enumerator with callback exception", function () {

		var callbackStub;

		before(function () {

			var ClientList = require('../lib/clientlist');
			var clientList = new ClientList();

			callbackStub = sinon.stub();
			callbackStub.throws();

			clientList.add("asda", "asdaddsa");
			clientList.add("bvsnbas", "sdhfjs");

			clientList.each(callbackStub);
		});

		it('should have callbacks twice', function () {
			assert(callbackStub.calledTwice);
		});

	});

	describe("Each enumerator with callback that modifies the list", function () {

		var callbackSpy;
		var count;

		before(function () {

			var ClientList = require('../lib/clientlist');
			var clientList = new ClientList();

			var callback = function () {
				clientList.add("dfsf", "fghgf");
			}

			callbackSpy = sinon.spy(callback);

			clientList.add("asda", "asdaddsa");
			clientList.add("bvsnbas", "sdhfjs");
			clientList.add("fddg", "12313");

			clientList.each(callbackSpy);

			count = clientList.count();
		});

		it('should have callbacks thrice', function () {
			assert(callbackSpy.calledThrice);
		});

		it('should have count() six', function () {
			assert.equal(6, count);
		});

	});
});