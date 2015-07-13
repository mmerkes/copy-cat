'use strict';

require('./validators');

var express = require('express'),
    routeValidator = require('express-route-validator'),
    validator = require('validator');

module.exports = function (config) {
  var router = express.Router(),
      router_v1_3 = express.Router();

  function unNestBody (req, res, next) {
    if (!req.body.request) {
      return res.status(400).end();
    }
    // Move un-nest body.request object to simplify validation
    // Use until express-route-validator supports nested validation
    req.body = req.body.request;
    return next();
  }

  router_v1_3.post('/createMessage', unNestBody, routeValidator.validate({
    body: {
      application: { isRequired: true },
      auth: { isRequired: true },
      notifications: { isRequired: true, arePushwooshNotifications: true, isLength: { min: 1 }}
    }
  }), function (req, res) {
    var unknownDevices, data, i, j, length, count, notification;
    if (config.application && !validator.isIn(req.body.application, config.application)) {
      return res.status(200).json({
        status_code: 210,
        status_message: "Application not found",
        response: null
      });
    }

    if (config.auth && !validator.isIn(req.body.auth, config.auth)) {
      return res.status(200).json({
        status_code: 210,
        status_message: "Account not found",
        response: null
      });
    }

    data = {
      status_code: 200,
      status_message: 'OK',
      response: {
        Messages: []
      }
    };

    unknownDevices = [];
    for (i = 0, length = req.body.notifications.length; i < length; i++) {
      data.response.Messages.push(Math.random().toString());
      if (config.devices && req.body.notifications[i].devices) {
        notification = req.body.notifications[i];
        for (j = 0, count = notification.devices.length; j < count; j++) {
          if (config.devices.indexOf(notification.devices[j]) === -1) {
            unknownDevices.push(notification.devices[j]);
          }
        }
      }
    }

    if (unknownDevices.length) {
      data.response.UnknownDevices = {
        "": unknownDevices
      };
    }

    return res.status(200).json(data);
  });

  router_v1_3.post('/deleteMessage', unNestBody, routeValidator.validate({
    body: {
      auth: { isRequired: true },
      message: { isRequired: true }
    }
  }), function (req, res) {
    if (config.messages && !validator.isIn(req.body.message, config.messages)) {
      return res.status(200).json({
        status_code: 210,
        status_message: 'Message not found',
        response: null
      });
    }

    if (config.auth && !validator.isIn(req.body.auth, config.auth)) {
      return res.status(200).json({
        status_code: 210,
        status_message: "Account not found",
        response: null
      });
    }

    return res.status(200).json({
      status_code: 200,
      status_message: 'OK'
    });
  });

  router_v1_3.post('/registerDevice', unNestBody, routeValidator.validate({
    body: {
      application: { isRequired: true },
      push_token: { isRequired: true },
      language: { isRequired: false },
      hwid: { isRequired: true },
      timezone: { isRequired: false },
      device_type: { isRequired: true, isInt: { min: 1, max: 11 }}
    }
  }), function (req, res) {
    if (config.application && !validator.isIn(req.body.application, config.application)) {
      return res.status(200).json({
        status_code: 210,
        status_message: "Application not found",
        response: null
      });
    }

    // TODO Validate push_token by device_type?
    // Accept config.push_tokens?
    // Accept config.hwids?

    return res.status(200).json({
      status_code: 200,
      status_message: 'OK',
      response: null
    });
  });

  router_v1_3.post('/unregisterDevice', unNestBody, routeValidator.validate({
    body: {
      application: { isRequired: true },
      hwid: { isRequired: true }
    }
  }), function (req, res) {
    if (config.application && !validator.isIn(req.body.application, config.application)) {
      return res.status(200).json({
        status_code: 210,
        status_message: "Application not found",
        response: null
      });
    }

    return res.status(200).json({
      status_code: 200,
      status_message: 'OK',
      response: null
    });
  });

  router.use('/json/1.3', router_v1_3);

  return router;
};