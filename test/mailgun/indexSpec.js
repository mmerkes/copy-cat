'use strict';

var request = require('supertest'),
    _ = require('lodash');

describe('INTEGRATION /mailgun/:version default', function () {
  var app;

  before( function () {
    app = require('../../index')({
      startServer: false,
      mailgun: {}
    });
  });

  describe('POST /messages v2 & v3', function () {
    var domain = 'test.example.com',
        url = '/mailgun/v3/' + domain + '/messages',
        auth = 'Basic MXBpOmpleS0xZDF4c3J6YMNmdGNuZjYtb2BxN2FpaTZqcWsyb25yOB==';

    var email = {
      from: 'Test <test@example.com>',
      to: 'Test <test@example.com>',
      subject: 'Testing',
      html: '<html><body>Testing</body></html>',
      text: 'testing'
    };

    it('should send a 200 and mailgun success object on success, v2', function (done) {
      request(app)
        .post('/mailgun/v2/' + domain + '/messages')
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(200, done);
    });

    it('should send a 200 and mailgun success object on success, v3', function (done) {
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(200, done);
    });

    it('should allow multiple emails for to property', function (done) {
      var invalid = _.assign({}, email);
      invalid.to = 'email@test.com, email@example.com';
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(200, done);
    });

    it('should send a 400 if content is not application/x-www-form-urlencoded', function (done) {
      request(app)
        .post(url)
        .send(email)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if no Authorization header', function (done) {
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .expect(400, done);
    });

    it('should send a 400 if invalid Authorization header', function (done) {
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', 'Basic ABC')
        .expect(200, done);
    });

    it('should send a 400 if version is invalid', function (done) {
      request(app)
        .post('/mailgun/v120/' + domain + '/messages')
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if domain is invalid', function (done) {
      request(app)
        .post('/mailgun/v3/banana/messages')
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if "from" property is undefined', function (done) {
      var invalid = _.assign({}, email);
      invalid.from = undefined;
      request(app)
        .post(url)
        .type('form')
        .send(invalid)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if "from" property is invalid', function (done) {
      var invalid = _.assign({}, email);
      invalid.from = 'nott@email';
      request(app)
        .post(url)
        .type('form')
        .send(invalid)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if "to" property is undefined', function (done) {
      var invalid = _.assign({}, email);
      invalid.to = undefined;
      request(app)
        .post(url)
        .type('form')
        .send(invalid)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if "to" property is invalid', function (done) {
      var invalid = _.assign({}, email);
      invalid.to = 'not@email';
      request(app)
        .post(url)
        .type('form')
        .send(invalid)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if "text" and "html" are undefined', function (done) {
      var invalid = _.assign({}, email);
      invalid.text = undefined;
      invalid.html = undefined;
      request(app)
        .post(url)
        .type('form')
        .send(invalid)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if "recipient-variables" property is not valid JSON', function (done) {
      var invalid = _.assign({}, email);
      invalid['recipient-variables'] = 'not JSON';
      request(app)
        .post(url)
        .type('form')
        .send(invalid)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should allow sending "recipient-variables" as JSON', function (done) {
      var valid = _.assign({}, email);
      valid['recipient-variables'] = JSON.stringify({ 'test@email.com': { foo: 'bar' }});
      request(app)
        .post(url)
        .type('form')
        .send(valid)
        .set('Authorization', auth)
        .expect(200, done);
    });
  });
});

describe('INTEGRATION /mailgun/:version configured', function () {
  var app,
      domains = ['example.com', 'test.com'],
      apiKeys = ['MXBpOmpleS0xZDF4c3J6YMNmdGNuZjYtb2BxN2FpaTZqcWsyb25yOB=='],
      versions = ['v3'];

  before( function () {
    app = require('../../index')({
      startServer: false,
      mailgun: {
        domains: domains,
        apiKeys: apiKeys,
        versions: versions
      }
    });
  });

  describe('POST /messages v3', function () {
    var url = '/mailgun/' + versions[0] + '/' + domains[0] + '/messages',
        auth = 'Basic ' + apiKeys[0];

    var email = {
      from: 'Test <test@example.com>',
      to: 'Test <test@example.com>',
      subject: 'Testing',
      html: '<html><body>Testing</body></html>',
      text: 'testing'
    };

    it('should send a 200 if the domain, apiKey, and version match configuration', function (done) {
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(200, done);
    });

    it('should send a 400 if domain does not match configuration', function (done) {
      var url = '/mailgun/' + versions[0] + '/not-the-one.com/messages';
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if apiKey does not match configuration', function (done) {
      var auth = 'Basic ' + apiKeys[0].replace(/B/g);
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(400, done);
    });

    it('should send a 400 if version does not match configuration', function (done) {
      var url = '/mailgun/v2/' + domains[0] + '/messages';
      request(app)
        .post(url)
        .type('form')
        .send(email)
        .set('Authorization', auth)
        .expect(400, done);
    });
  });
});