'use strict';

var chai = require('chai'),
    expect = chai.expect,
    routeValidator = require('express-route-validator');

describe('UNIT pushwhoosh/validators.js', function () {
  before( function () {
    require('../../lib/pushwhoosh/validators');
  });

  it('should add arePushwhooshNotifications as a validator for routeValidator', function () {
    expect(routeValidator._validators).to.have.property('arePushwhooshNotifications').that.is.a('function');
  });

  describe('arePushwhooshNotifications(notifications)', function () {
    var validNotification = {
      send_date: "now",
      ignore_user_timezone: true,
      content: "Hello world!",
      android_root_params: { foo: 'bar' },
      ios_root_params: {
        aps: { 'content-available': '1' }
      },
      platforms: [1, 3]
    };

    it('should return true if notifications only contains valid PushWhoosh notification objects', function () {
      var valid = routeValidator._validators.arePushwhooshNotifications([validNotification, validNotification]);
      expect(valid).to.be.true;
    });

    it('should return false if notifications is not an array', function () {
      var valid = routeValidator._validators.arePushwhooshNotifications('banana');
      expect(valid).to.be.false;
    });

    it('should return false if a notification.android_root_params exists and is not an object', function () {
      var invalidNotification = {
        send_date: "now",
        ignore_user_timezone: true,
        content: "Hello world!",
        android_root_params: 'banana'
      };
      var valid = routeValidator._validators.arePushwhooshNotifications([validNotification, invalidNotification]);
      expect(valid).to.be.false;
    });

    it('should return false if a notification.ios_root_params exists and is not an object', function () {
      var invalidNotification = {
        send_date: "now",
        ignore_user_timezone: true,
        content: "Hello world!",
        ios_root_params: 'banana'
      };
      var valid = routeValidator._validators.arePushwhooshNotifications([invalidNotification, validNotification]);
      expect(valid).to.be.false;
    });

    it('should return false if a notification.platform is > 11', function () {
      var invalidNotification = {
        send_date: "now",
        ignore_user_timezone: true,
        content: "Hello world!",
        platforms: [1, 3, 12]
      };
      var valid = routeValidator._validators.arePushwhooshNotifications([invalidNotification]);
      expect(valid).to.be.false;
    });

    it('should return false if a notification.platform is < 1', function () {
      var invalidNotification = {
        send_date: "now",
        ignore_user_timezone: true,
        content: "Hello world!",
        platforms: [0, 1, 3]
      };
      var valid = routeValidator._validators.arePushwhooshNotifications([invalidNotification]);
      expect(valid).to.be.false;
    });
  });
});