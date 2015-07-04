'use strict';

require('./validators');

var express = require('express'),
    routeValidator = require('express-route-validator'),
    validator = require('validator');

module.exports = function (config) {
  var router = express.Router(),
      router_v1_3 = express.Router(),
      createMessageValidators = [];

  router_v1_3.post('/createMessage', routeValidator.validate({
    body: {
      application: { isRequired: true },
      auth: { isRequired: true },
      notifications: { isRequired: true, arePushwhooshNotifications: true, isLength: { min: 1 }}
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

  router.use('/json/1.3', router_v1_3);

  return router;
};