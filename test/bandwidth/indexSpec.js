'use strict';

var request = require('supertest'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('lodash'),
    db = require('../../lib/db');

describe('INTEGRATION /bandwidth/v1 default', function () {
  var app;
  var message = {
    from: "+14155791234",
    to: "+19713131234",
    text: "Test duder"
  };

  before( function () {
    app = require('../../index')({
      startServer: false,
      bandwidth: {}
    });
  });

  after( function () {
    db.reset();
  });

  describe('POST /users/:user/messages', function () {
    var url = '/bandwidth/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages';

    it('should require authentication', function (done) {
      request(app)
        .post(url)
        .send(message)
        .expect(401, done);
    });

    describe('with a single message', function () {
      it('should only accept application/json', function (done) {
        request(app)
          .post(url)
          .type('form')
          .auth('dude', 'secret')
          .send(message)
          .expect(400, done);
      });

      it('should require body.from to be a valid phone number', function (done) {
        var body = _.assign({}, message);
        body.from = '1234567';
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send(body)
          .expect(400, done);
      });

      it('should require body.to to be a valid phone number', function (done) {
        var body = _.assign({}, message);
        body.to = '1234567';
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send(body)
          .expect(400, done);
      });

      it('should require body.text', function (done) {
        var body = _.assign({}, message);
        body.text = undefined;
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send(body)
          .expect(400, done);
      });

      it('should send a 400 if body.text is larger than 2048 characters', function (done) {
        var body = _.assign({}, message);
        while (body.text.length <= 2048) {
          body.text += 'some more text for you';
        }
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send(body)
          .expect(400, done);
      });

      it('should save a valid message into in memory db', function (done) {
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send(message)
          .expect(201, function (err, res) {
            if (err) return done(err);
            expect(res.headers).to.have.property('location');
            var location = res.headers.location;
            var id = location.substr(location.length - 24);
            expect(db.store.bandwidth.getMessage(id)).to.exist;
            return done();
          });
      });
    });

    describe('with multiple messages', function () {
      it('should validate the messages', function (done) {
        var body = _.assign({}, message);
        body.to = '1234567';
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send([body, body])
          .expect(400, done);
      });

      // Actual API will not invalidate response if a message is invalid
      it('should send a 400 if any of the messages are invalid, even if some are valid', function (done) {
        var body = _.assign({}, message);
        body.to = '1234567';
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send([message, body])
          .expect(400, done);
      });

      it('should save valid messages in memory db and send an array of locations in body', function (done) {
        request(app)
          .post(url)
          .auth('dude', 'secret')
          .send([message, message])
          .expect(201, function (err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an.instanceOf(Array).and.have.property('length').that.equals(2);
            res.body.forEach( function (obj) {
              expect(obj).to.have.property('result').that.equals('accepted');
              expect(obj).to.have.property('location');
              var id = obj.location.substr(obj.location.length - 24);
              expect(db.store.bandwidth.getMessage(id)).to.exist;
            });
            return done();
          });
      });
    });
  });

  describe('GET /users/:user/messages/:message', function () {
    var id, urlStub = '/bandwidth/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages/';

    before( function (done) {
      request(app)
        .post('/bandwidth/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages')
        .auth('dude', 'secret')
        .send(message)
        .expect(201, function (err, res) {
          if (err) return done(err);
          var location = res.headers.location;
          id = location.substr(location.length - 24);
          return done();
        });
    });

    it('should require authentication', function (done) {
      request(app)
        .get(urlStub + id)
        .expect(401, done);
    });

    it('should return a 404 if message does not exist', function (done) {
      request(app)
        .get(urlStub + 'not-a-message')
        .auth('dude', 'secret')
        .expect(404, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('category').that.equals('not-found');
          expect(res.body).to.have.property('code').that.equals('message-not-found');
          expect(res.body).to.have.property('details').that.is.an.instanceOf(Array);
          return done();
        });
    });

    it('should a message object on success', function (done) {
      request(app)
        .get(urlStub + id)
        .auth('dude', 'secret')
        .expect(200, function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property('direction').that.equals('out');
          expect(res.body).to.have.property('from').that.equals(message.from);
          expect(res.body).to.have.property('to').that.equals(message.to);
          expect(res.body).to.have.property('text').that.equals(message.text);
          expect(res.body).to.have.property('state').that.equals('sent');
          expect(res.body).to.have.property('id').that.equals(id);
          expect(res.body).to.have.property('messageId').that.equals(id);
          expect(res.body).to.have.property('time').that.is.a('string');
          return done();
        });
    });
  });
});

describe('INTEGRATION /bandwidth/v1 configured', function () {
  var app;
  var config = {
    apiToken: 'a-ascc4wo4zyq7as366hxkhas',
    apiSecret: 'ascoslxnasalqfbtashrkxasz545jdtkrcb2zas',
    userId: 'a-b5h4y5x6vcw5aszyyzsmsas'
  };
  var message = {
    from: "+14155791234",
    to: "+19713131234",
    text: "Test duder"
  };

  before( function () {
    app = require('../../index')({
      startServer: false,
      bandwidth: config
    });
  });

  after( function () {
    db.reset();
  });

  describe('POST /users/:user/messages', function () {
    var url = '/bandwidth/v1/users/' + config.userId + '/messages';

    it('should invalidate request if apiToken does not match config', function (done) {
      request(app)
        .post(url)
        .auth('dude', config.apiSecret)
        .send(message)
        .expect(401, done);
    });

    it('should invalidate request if apiSecret does not match config', function (done) {
      request(app)
        .post(url)
        .auth(config.apiToken, 'keep dreaming')
        .send(message)
        .expect(401, done);
    });

    it('should invalidate request if userId does not match config', function (done) {
      request(app)
        .post('/bandwidth/v1/users/' + config.userId.replace('a', 'b', 'g') + '/messages')
        .auth(config.apiToken, config.apiSecret)
        .send(message)
        .expect(401, done);
    });

    it('should successfully handle request when valid', function (done) {
      request(app)
        .post(url)
        .auth(config.apiToken, config.apiSecret)
        .send(message)
        .expect(201, done);
    });
  });

  describe('GET /users/:user/messages/:message', function () {
    var url = '/bandwidth/v1/users/' + config.userId + '/messages/', id;

    before( function (done) {
      request(app)
        .post('/bandwidth/v1/users/' + config.userId + '/messages')
        .auth(config.apiToken, config.apiSecret)
        .send(message)
        .expect(201, function (err, res) {
          if (err) return done(err);
          var location = res.headers.location;
          id = location.substr(location.length - 24);
          url += id;
          return done();
        });
    });

    it('should invalidate request if apiToken does not match config', function (done) {
      request(app)
        .get(url)
        .auth('dude', config.apiSecret)
        .expect(401, done);
    });

    it('should invalidate request if apiSecret does not match config', function (done) {
      request(app)
        .get(url)
        .auth(config.apiToken, 'keep dreaming')
        .expect(401, done);
    });

    it('should invalidate request if userId does not match config', function (done) {
      request(app)
        .get('/bandwidth/v1/users/' + config.userId.replace('a', 'b', 'g') + '/messages/' + id)
        .auth(config.apiToken, config.apiSecret)
        .expect(401, done);
    });

    it('should successfully handle request when valid', function (done) {
      request(app)
        .get(url)
        .auth(config.apiToken, config.apiSecret)
        .expect(200, done);
    });
  });
});