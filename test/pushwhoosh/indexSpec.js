'use strict';

var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest');

describe('INTEGRATION /pushwhoosh/json/1.3 default', function () {
  var app, url = '/pushwhoosh/json/1.3';

  before( function () {
    app = require('../../index')({
      startServer: false,
      pushwhoosh: {}
    });
  });

  it('should mark PushWhoosh as an active platform on GET /version when active', function (done) {
    request(app)
      .get('/version')
      .expect(200, function (err, res) {
        if (err) return done(err);
        expect(res.body.activePlatforms).to.have.property('pushwhoosh').that.is.true;
        return done();
      });
  });

  describe('POST /createMessage', function () {
    it('should return a 400 if body.request is undefined', function (done) {
      request(app)
        .post(url + '/createMessage')
        .expect(400, done);
    });

    it('should send a 400 if body.application is undefined', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            auth: "API_ACCESS_TOKEN",
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.application');
          return done();
        });
    });

    it('should send a 400 if body.auth is undefined', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: "APPLICATION_CODE",
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.auth');
          return done();
        });
    });

    it('should send a 400 if body.notifications is undefined', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: "APPLICATION_CODE",
            auth: "API_ACCESS_TOKEN"
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.notifications');
          return done();
        });
    });

    it('should send a 400 if body.notifications is an empty array', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: "APPLICATION_CODE",
            auth: "API_ACCESS_TOKEN",
            notifications: []
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.notifications');
          return done();
        });
    });

    it('should send a 400 if any of the notifications are invalid', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: "APPLICATION_CODE",
            auth: "API_ACCESS_TOKEN",
            notifications: [{
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.notifications');
          return done();
        });
    });

    it('should send a 200 and response object if valid', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: "APPLICATION_CODE",
            auth: "API_ACCESS_TOKEN",
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.an('object');
          expect(res.body.response).to.have.property('Messages').that.is.an.instanceOf(Array)
            .and.to.have.property('length').that.equals(1);
          return done();
        });
    });
  });

  describe('POST /deleteMessage', function () {
    it('should return a 400 if body.request is undefined', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .expect(400, done);
    });

    it('should send a 400 if auth is undefined', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .send({
          request: {
            message: 'MESSAGE_CODE'
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.auth');
          return done();
        });
    });

    it('should send a 400 if message is undefined', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .send({
          request: {
            auth: "API_ACCESS_TOKEN"
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.message');
          return done();
        });
    });

    it('should send a 200 with status_code set to 200 if successful', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .send({
          request: {
            auth: "API_ACCESS_TOKEN",
            message: 'MESSAGE_CODE'
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          return done();
        });
    });
  });

  describe('POST /registerDevice', function () {
    it('should return a 400 if body.request is undefined', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .expect(400, done);
    });

    it('should send a 400 if body.application is undefined', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600,
            device_type: 1
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.application');
          return done();
        });
    });

    it('should send a 400 if body.push_token is undefined', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600,
            device_type: 1
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.push_token');
          return done();
        });
    });

    it('should send a 400 if body.hwid is undefined', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            timezone: 3600,
            device_type: 1
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.hwid');
          return done();
        });
    });

    it('should send a 400 if body.device_type is undefined', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.device_type');
          return done();
        });
    });

    it('should send a 400 if body.device_type is invalid', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600,
            device_type: 100
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.device_type');
          return done();
        });
    });

    it('should send a 200 with a status_code of 200 if successful', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600,
            device_type: 1
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });
  });

  describe('POST /unregisterDevice', function () {
    it('should return a 400 if body.request is undefined', function (done) {
      request(app)
        .post(url + '/unregisterDevice')
        .expect(400, done);
    });

    it('should send a 400 if body.application is undefined', function (done) {
      request(app)
        .post(url + '/unregisterDevice')
        .send({
          request: {
            hwid: "hardware device id"
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.application');
          return done();
        });
    });

    it('should send a 400 if body.hwid is undefined', function (done) {
      request(app)
        .post(url + '/unregisterDevice')
        .send({
          request: {
            application: "APPLICATION_CODE"
          }
        })
        .expect(400, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('error').that.contains('body.hwid');
          return done();
        });
    });

    it('should send a 200 with a status_code of 200 if successful', function (done) {
      request(app)
        .post(url + '/unregisterDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            hwid: "hardware device id"
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });
  });
});

describe('INTEGRATION /pushwhoosh/json/1.3 configured', function () {
  var app,
      url = '/pushwhoosh/json/1.3',
      applicationCodes = ['A91GE-ABD43'],
      authTokens = ['F5ZO2NtuDy4L1c5j3y1Qd52yMoEOj51z5Ma2tDtz1QqzUeEIXGtKGltn53bp3hG33L1lXZVTzKL4zX5NukBe'],
      devices = ["477A3B81-EAC1-4174-938D-180E6ECB0B39"],
      messages = ['1', '2', '3'];

  before( function () {
    app = require('../../index')({
      startServer: false,
      pushwhoosh: {
        application: applicationCodes,
        auth: authTokens,
        devices: devices,
        messages: messages
      }
    });
  });

  describe('POST /createMessage', function () {
    it('should send a 200 with a 210 status_code and a status_message if the application code did not match config', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: "APPLICATION_CODE",
            auth: authTokens[0],
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(210);
          expect(res.body).to.have.property('status_message').that.equals('Application not found');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });

    it('should send a 200 with a 210 status_code and a status_message if the auth token did not match config', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: applicationCodes[0],
            auth: "API_ACCESS_TOKEN",
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(210);
          expect(res.body).to.have.property('status_message').that.equals('Account not found');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });

    it('should send a 200 with OK status_message and UnknownDevices populated with ids if did not match config', function (done) {
      var dummyDevice = 'banana';
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: applicationCodes[0],
            auth: authTokens[0],
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!",
              devices: [dummyDevice].concat(devices)
            }]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.an('object');
          expect(res.body.response).to.have.property('Messages').that.is.an.instanceOf(Array);
          expect(res.body.response.Messages).to.have.property('length').that.equals(1);
          expect(res.body.response).to.have.property('UnknownDevices').that.has.property("")
            .that.is.an.instanceOf(Array).that.has.property('length').that.equals(1);
          expect(res.body.response.UnknownDevices[""].indexOf(dummyDevice)).to.not.equal(-1);
          return done();
        });
    });

    it('should send a 200 and response object if valid with devices', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: applicationCodes[0],
            auth: authTokens[0],
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!",
              devices: devices
            }]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.an('object');
          expect(res.body.response).to.have.property('Messages').that.is.an.instanceOf(Array)
            .and.to.have.property('length').that.equals(1);
          expect(res.body.response).to.not.have.property('UnknownDevices');
          return done();
        });
    });

    it('should send a 200 and response object if valid without devices', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          request: {
            application: applicationCodes[0],
            auth: authTokens[0],
            notifications: [{
              send_date: "now",
              ignore_user_timezone: true,
              content: "Hello world!"
            }]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.an('object');
          expect(res.body.response).to.have.property('Messages').that.is.an.instanceOf(Array)
            .and.to.have.property('length').that.equals(1);
          return done();
        });
    });
  });

  describe('POST /deleteMessage', function () {
    it('should send a 200 with a 210 status_code if message is not in config.messages', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .send({
          request: {
            auth: authTokens[0],
            message: 'MESSAGE_CODE'
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(210);
          expect(res.body).to.have.property('status_message').that.equals('Message not found');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });

    it('should send a 200 with a 210 status_code and a status_message if the auth token did not match config', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .send({
          request: {
            auth: "API_ACCESS_TOKEN",
            message: messages[0]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(210);
          expect(res.body).to.have.property('status_message').that.equals('Account not found');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });

    it('should send a 200 with status_code set to 200 if successful and message matches configured code', function (done) {
      request(app)
        .post(url + '/deleteMessage')
        .send({
          request: {
            auth: authTokens[0],
            message: messages[0]
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          return done();
        });
    });
  });

  describe('POST /registerDevice', function () {
    it('should send a 200 with a 210 status_code and a status_message if the application code did not match config', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600,
            device_type: 1
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(210);
          expect(res.body).to.have.property('status_message').that.equals('Application not found');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });

    it('should send a 200 with a status_code of 200 if successful', function (done) {
      request(app)
        .post(url + '/registerDevice')
        .send({
          request: {
            application: applicationCodes[0],
            push_token: "DEVICE_PUSH_TOKEN",
            language: "en",
            hwid: "hardware device id",
            timezone: 3600,
            device_type: 1
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });
  });

  describe('POST /unregisterDevice', function () {
    it('should send a 200 with a 210 status_code and a status_message if the application code did not match config', function (done) {
      request(app)
        .post(url + '/unregisterDevice')
        .send({
          request: {
            application: "APPLICATION_CODE",
            hwid: "hardware device id"
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(210);
          expect(res.body).to.have.property('status_message').that.equals('Application not found');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });

    it('should send a 200 with a status_code of 200 if successful', function (done) {
      request(app)
        .post(url + '/unregisterDevice')
        .send({
          request: {
            application: applicationCodes[0],
            hwid: "hardware device id"
          }
        })
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('status_code').that.equals(200);
          expect(res.body).to.have.property('status_message').that.equals('OK');
          expect(res.body).to.have.property('response').that.is.null;
          return done();
        });
    });
  });
});