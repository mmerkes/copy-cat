'use strict';

var express = require('express'),
    routeValidator = require('express-route-validator'),
    db = require('../db');

require('./validators');

module.exports = function (config) {
  var router = express.Router(),
      router_v1 = express.Router();

  // Add store for bandwidth to track messages
  var store = db.addStore('bandwidth', {
    messages: {}, // Store messages hashed by ids
    reset: function () {
      this.messages = {};
    },
    addMessage: function (message) {
      this.messages[message.id] = message;
    },
    getMessage: function (id) {
      return this.messages[id];
    }
  });

  // If config includes a token and secret, check that header matches
  if (config.apiToken && config.apiSecret) {
    var authorizationHeader = 'Basic ' + new Buffer(config.apiToken + ':' + config.apiSecret).toString('base64');
  }

  function _authenticateRequest (req, res, next) {
    if (!req.headers.authorization || authorizationHeader && req.headers.authorization !== authorizationHeader) {
      return res.status(401).end();
    }

    if (config.userId && req.params.user !== config.userId) {
      return res.status(401).end();
    }

    return next();
  }

  // router_v1.use(_authenticateRequest);

  // Save a reference to the POST /messages validator config to reuse on case where body is an array of messages
  var postMessagesValidationConfig = {
    body: {
      from: { isRequired: true, isBandwidthPhoneNumber: true, toE164PhoneNumber: true, note: 'Should be E.164 format, but API will try to format. Number must be configured in your application.' },
      to: { isRequired: true, isBandwidthPhoneNumber: true, toE164PhoneNumber: true, note: 'Should be E.164 format, but API will try to format.' },
      text: { isRequired: true, isLength: { min: 1, max: 2048 }, note: 'Text of message. Can\'t be greater than 2,048 characters' },
      receiptRequested: { isRequired: false, isIn: ['none', 'all', 'error' ], note: 'Requested receipt option for outbound messages: none all error Default is none.' },
      callbackUrl: { isRequired: false, isUrl: true, note: 'The server URL where the events related to the outgoing message will be sent to.' },
      callbackHttpMethod: { isRequired: false, isIn: ['get', 'post'], note: 'Determine if the callback event should be sent via HTTP GET or HTTP POST. Values are get or post Default is post' },
      callbackTimeout: { isRequired: false, isInt: true, note: 'Determine how long should the platform wait for callbackUrl\'s response before timing out (milliseconds).' },
      fallbackUrl: { isRequired: false, isUrl: true, note: 'The server URL used to send the message events if the request to callbackUrl fails.' },
      tag: { isRequired: false, note: 'Any string, it will be included in the callback events of the message.' }
    },
    headers: {
      'content-type': { isRequired: true, equals: 'application/json', note: 'Must send JSON' },
    },
    params: {
      user: { isRequired: true, note: 'User id for requestor' }
    }
  };

  // Save validator closure to use in case where body is an array of messages and can be manually called
  var postMessagesValidator = routeValidator.validate({
    body: postMessagesValidationConfig.body,
    callNext: true
  });

  router_v1.post('/users/:user/messages', _authenticateRequest, function (req, res, next) {
    // Check if body is an array of messages. If so, pass to the next route handler
    if (req.body instanceof Array) {
      return next('route');
    } else {
      return next();
    }
  }, routeValidator.validate(postMessagesValidationConfig), function (req, res) {
    var message = _generateMessage(req.body.from, req.body.to, req.body.text);
    // Store message in memory to enable GET /messages/:message
    store.addMessage(message);

    // Set response headers to match Bandwidth
    res.set('Cache-Control', 'no-cache');
    res.set('Location', req.protocol + '://' + req.hostname + req.originalUrl + '/' + message.id);

    return res.status(201).end();
  });

  // Handle case where body is an array of messages
  router_v1.post('/users/:user/messages', _authenticateRequest, routeValidator.validate({
    headers: postMessagesValidationConfig.headers,
    params: postMessagesValidationConfig.params
  }), function (req, res, next) {
    var error;
    for (var i = 0, length = req.body.length; i < length; i++) {
      postMessagesValidator({
        body: req.body[i]
      }, {}, _setError);
    }

    if (error) {
      return res.status(400).send({
        error: error.message
      });
    }

    return next();

    function _setError (err) {
      if (err) {
        error = err;
      }
    }
  }, function (req, res) {
    var messages = [],
        message,
        data = [],
        locationStub = req.protocol + '://' + req.hostname + req.originalUrl + '/';

    for (var i = 0, length = req.body.length; i < length; i++) {
      message = _generateMessage(req.body[i].from, req.body[i].to, req.body[i].text);
      messages.push(message);
      store.addMessage(message);
      data.push({
        result: 'accepted',
        location: locationStub + message.id
      });
    }

    // Set response headers to match Bandwidth
    res.set('Cache-Control', 'no-cache');

    return res.status(201).send(data);
  });

  router_v1.get('/users/:user/messages/:message', _authenticateRequest, routeValidator.validate({
    params: {
      message: { isRequired: true, note: 'ID of the message requesting' },
      user: { isRequired: true, note: 'User id for requestor' }
    }
  }), function (req, res) {
    var message = store.getMessage(req.params.message);

    if (!message) {
      return res.status(404).json({
        category: "not-found",
        code: "message-not-found",
        message: "The message '" + req.params.message + "' could not be found",
        details: [
          {
            name: "messageId",
            value: req.params.message
          },
          {
            name: "requestMethod",
            value: "GET"
          },
          {
            name: "remoteAddress",
            value: req.ip
          },
          {
            name: "requestPath",
            value: "users/" + req.params.user + "/messages/" + req.params.message
          }
        ]
      });
    }

    // Set response header to match Bandwidth
    res.set('Cache-Control', 'no-cache');

    return res.status(200).json(message);
  });

  router.use('/v1', router_v1);

  return router;

  function _generateMessageId () {
    return 'm-i2c5jvxizg6w' + ('' + Math.random()).substr(2,10);
  }

  function _generateMessage (from, to, text) {
    var id = _generateMessageId();
    return {
      direction: 'out',
      from: from,
      id: id,
      messageId: id,
      state: 'sent',
      text: text,
      media: [],
      time: new Date(),
      to: to,
      skipMMSCarrierValidation: false
    };
  }
};