'use strict';

var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest');

describe('INTEGRATION server.js', function () {
  var app;

  before( function () {
    app = require('../index')({});
  });

  it('should send a 404 if route does not exist', function (done) {
    request(app)
      .get('/foobar')
      .expect(404, done);
  });

  it('should should not include PushWhoosh routes if not configured', function (done) {
    request(app)
      .post('/pushwhoosh/json/1.3/createMessage')
      .send({})
      .expect(404, done);
  });
});