'use strict';

var chai = require('chai'),
    expect = chai.expect,
    routeValidator = require('express-route-validator');

describe('UNIT mailgun/validators.js', function () {
  before( function () {
    require('../../lib/mailgun/validators')({
      apiKeys: ['MXBpOmpleS0xZDF4c3J6YMNmdGNuZjYtb2BxN2FpaTZqcWsyb25yOB==']
    });
  });

  after( function () {
    // Reset validators to defaults
    require('../../lib/mailgun/validators')({});
  });

  it('should add isMailgunApiKey as a validator', function () {
    expect(routeValidator._validators).to.have.property('isMailgunApiKey').that.is.a('function');
  });

  it('should add isMailgunDomain as a validator', function () {
    expect(routeValidator._validators).to.have.property('isMailgunDomain').that.is.a('function');
  });

  it('should add isMailgunEmail as a validator', function () {
    expect(routeValidator._validators).to.have.property('isMailgunEmail').that.is.a('function');
  });

  it('should add isMailgunEmails as a validator', function () {
    expect(routeValidator._validators).to.have.property('isMailgunEmails').that.is.a('function');
  });

  describe('#isMailgunApiKey(str)', function () {
    it('should return false if auth is not basic auth', function () {
      var valid = routeValidator._validators.isMailgunApiKey('Bearer MXBpOmpleS0xZDF4c3J6YMNmdGNuZjYtb2BxN2FpaTZqcWsyb25yOB==');
      expect(valid).to.be.false;
    });

    it('should return false if api key is not base64', function () {
      var valid = routeValidator._validators.isMailgunApiKey('Basic banana');
      expect(valid).to.be.false;
    });
  });

  describe('#isMailgunEmail(str)', function () {
    it('should return false if email is invalid', function () {
      var valid = routeValidator._validators.isMailgunEmail('Matt');
      expect(valid).to.be.false;
    });

    it('should return true if name and email in brackets, i.e. Matt <test@example.com>', function () {
      var valid = routeValidator._validators.isMailgunEmail('Matt <test@example.com>');
      expect(valid).to.be.true;
    });

    it('should return true if name and straight email, i.e. Matt test@example.com', function () {
      var valid = routeValidator._validators.isMailgunEmail('Matt test@example.com');
      expect(valid).to.be.true;
    });

    it('should return true if straight email, i.e. test@example.com', function () {
      var valid = routeValidator._validators.isMailgunEmail('test@example.com');
      expect(valid).to.be.true;
    });

    it('should return true if email in brackets, i.e. <test@example.com>', function () {
      var valid = routeValidator._validators.isMailgunEmail('<test@example.com>');
      expect(valid).to.be.true;
    });
  });
});