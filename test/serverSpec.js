'use strict';

var request = require('supertest'),
    utils = require('./utils');

describe('INTEGRATION server.js', function () {
  var app;

  before( function () {
    app = require('../lib/server')({});
  });

  after( function (done) {
    app.server.close(done);
  });

  it('should start a server on port 3001 by default', function (done) {
    request('http://localhost:3001')
      .get('/version')
      .expect(200, done);
  });

  it('should send a 404 if route does not exist', function (done) {
    request(app)
      .get('/foobar')
      .expect(404, done);
  });

  it('should should not include PushWhoosh routes if not configured', function (done) {
    request(app)
      .post('/pushwoosh/json/1.3/createMessage')
      .send({})
      .expect(404, done);
  });

  describe('config.port', function () {
    var port = utils.getNextPort(), app;

    before( function () {
      app = require('../lib/server')({
        port: port
      });
    });

    after( function (done) {
      app.server.close(done);
    });

    it('should start a server on the specified port', function (done) {
      request('http://localhost:' + port)
        .get('/version')
        .expect(200, done);
    });
  });
});