'use strict';

var routeValidator = require('express-route-validator'),
    phone = require('phone');

routeValidator.addValidators({
  // Check that phone can be converted to E.164 format
  isBandwidthPhoneNumber: function (str) {
    return phone(str).length;
  }
});