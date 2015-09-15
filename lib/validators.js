'use strict';

var routeValidator = require('express-route-validator'),
    phone = require('phone');

routeValidator.addCoercers({
  toE164PhoneNumber: {
    stage: 'before',
    coerce: function (str) {
      return phone(str)[0];
    }
  }
});