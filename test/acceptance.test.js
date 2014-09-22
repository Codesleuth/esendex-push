var io = require('socket.io-client'),
    server = require('../lib/server'),
    request = require('supertest'),
    assert = require('assert');

describe('Acceptance Tests', function () {

  var url;
  var s;

  before(function (done) {
    var port = 8123;
    var host = 'localhost';
    s = server.create();
    s.listen(port, host, function () {
      url = 'http://' + host + ':' + port;
      done();
    });
  });

  after(function () {
    s.close();
  });

  describe('All Messages', function () {

    var accountid;
    var socket;
    var deliveredData;
    var inboundData;
    var failedData;

    before(function (done) {
      accountid = '00000000-0000-0000-0000-000000000000';

      socket = io.connect(url);
      socket.on('connect', function () {

        socket.emit('accountid', accountid);

        socket.on('delivered', function (data) {
          deliveredData = data;
        });

        socket.on('inbound', function (data) {
          inboundData = data;
        });

        socket.on('failure', function (data) {
          failedData = data;
          socket.close();
          done();
        });

        request(url)
          .post('/delivered')
          .send('<MessageDelivered><AccountId>' + accountid + '</AccountId></MessageDelivered>')
          .expect(200)
          .end(function () {

              request(url)
              .post('/inbound')
              .send('<InboundMessage><AccountId>' + accountid + '</AccountId></InboundMessage>')
              .expect(200)
              .end(function () {

                  request(url)
                    .post('/failure')
                    .send('<MessageFailed><AccountId>' + accountid + '</AccountId></MessageFailed>')
                    .expect(200)
                    .end(function () {

                    });
              });
          });
      });
    });

    it('should receive the delivered push', function () {
      assert.equal(deliveredData.accountId, accountid);
      assert.equal(deliveredData.push.AccountId, accountid);
    });

    it('should receive the inbound push', function () {
      assert.equal(inboundData.accountId, accountid);
      assert.equal(inboundData.push.AccountId, accountid);
    });

    it('should receive the inbound push', function () {
      assert.equal(failedData.accountId, accountid);
      assert.equal(failedData.push.AccountId, accountid);
    });

  });

});