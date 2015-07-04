'use strict';

var routeValidator = require('express-route-validator'),
    validator = require('validator');

function _isValidNotification (notification) {
  if (!notification.send_date || !notification.content) {
    return false;
  }

  if (notification.android_root_params && typeof notification.android_root_params !== 'object' ||
      notification.ios_root_params && typeof notification.ios_root_params !== 'object') {
    return false;
  }

  if (notification.platforms) {
    for (var i = 0, length = notification.platforms.length; i < length; i++) {
      if (validator.isInt(notification.platforms[i], { min: 1, max: 11 })) {
        return false;
      }
    }
  }

  return true;
}

routeValidator.addValidators({
  arePushwhooshNotifications: function (notifications) {
    if (!(notifications instanceof Array)) {
      return false;
    }

    for (var i = 0, length = notifications.length; i < length; i++) {
      if (!_isValidNotification(notifications[i])) {
        return false;
      }
    }

    return true;
  }
});