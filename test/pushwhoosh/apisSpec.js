'use strict';

var chai = require('chai'),
    expect = chai.expect,
    request = require('supertest'),
    utils = require('../utils')

describe('INTEGRATION /pushwhoosh/json/1.3 basic', function () {
  var app, url = '/pushwhoosh/json/1.3';

  before( function () {
    app = require('../../index')({
      port: utils.getNextPort(),
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
    it('should send a 400 if body.application is undefined', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          auth: "API_ACCESS_TOKEN",
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
          application: "APPLICATION_CODE",
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
          application: "APPLICATION_CODE",
          auth: "API_ACCESS_TOKEN"
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
          application: "APPLICATION_CODE",
          auth: "API_ACCESS_TOKEN",
          notifications: []
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
          application: "APPLICATION_CODE",
          auth: "API_ACCESS_TOKEN",
          notifications: [{
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
          application: "APPLICATION_CODE",
          auth: "API_ACCESS_TOKEN",
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
});

describe('INTEGRATION /pushwhoosh/json/1.3 configured', function () {
  var app,
      url = '/pushwhoosh/json/1.3',
      applicationCodes = ['A91GE-ABD43'],
      authTokens = ['F5ZO2NtuDy4L1c5j3y1Qd52yMoEOj51z5Ma2tDtz1QqzUeEIXGtKGltn53bp3hG33L1lXZVTzKL4zX5NukBe'],
      devices = ["477A3B81-EAC1-4174-938D-180E6ECB0B39"];

  before( function () {
    app = require('../../index')({
      port: utils.getNextPort(),
      pushwhoosh: {
        application: applicationCodes,
        auth: authTokens,
        devices: devices
      }
    });
  });

  describe('POST /createMessage', function () {
    it('should send a 200 with a 210 status_code and a status_message if the application code did not match config', function (done) {
      request(app)
        .post(url + '/createMessage')
        .send({
          application: "APPLICATION_CODE",
          auth: authTokens[0],
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
          application: applicationCodes[0],
          auth: "API_ACCESS_TOKEN",
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
          application: applicationCodes[0],
          auth: authTokens[0],
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!",
            devices: [dummyDevice].concat(devices)
          }]
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
          application: applicationCodes[0],
          auth: authTokens[0],
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!",
            devices: devices
          }]
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
          application: applicationCodes[0],
          auth: authTokens[0],
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: "Hello world!"
          }]
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
});