'use strict';

var routeValidator = require('express-route-validator'),
    validator = require('validator');

module.exports = function (config) {
  routeValidator.addValidators({
    isMailgunApiKey: function (str) {
      if (!config.apiKeys || !config.apiKeys.length) {
        return true;
      }

      var split = str.split(' ');
      if (split[0] !== 'Basic' || !validator.isBase64(split[1])) {
        return false;
      }

      return config.apiKeys.indexOf(split[1]) !== -1;
    },

    isMailgunDomain: function (str) {
      if (!validator.isURL(str)) {
        return false;
      }

      if (!config.domains || !config.domains.length) {
        return true; 
      }

      return config.domains.indexOf(str) !== -1;
    },

    isMailgunEmail: function (str) {
      if (validator.isEmail(str, { allow_display_name: true })) {
        return true;
      }
      // Check for mailgun special case Mailgun allows: Matt test@example.com
      var split = str.split(' '),
          email = split[split.length - 1];

      return validator.isEmail(email) || validator.isEmail(email.replace(/[<>]/g, ''));
    },

    isMailgunEmails: function (str) {
      var emails = str.split(',');
      for (var i = 0, length = emails.length; i < length; i++) {
        if (!routeValidator._validators.isMailgunEmail(emails[i].trim())) {
          return false;
        }
      }
      return true;
    }
  });
};