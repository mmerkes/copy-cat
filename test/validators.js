'use strict';

var chai = require('chai'),
    expect = chai.expect,
    routeValidator = require('express-route-validator'),
    phone = require('phone');

describe('UNIT validator.js', function () {
  before( function () {
    require('../lib/validators');
  });

  it('should add custom validators', function () {
    expect(routeValidator._before).to.have.property('toE164PhoneNumber').that.is.a('function');
  });

  describe('toE164PhoneNumber', function () {
    it('should convert valid phone numbers to E.164 format', function () {
      var validNumbers = ['(817) 569-8900', '817569-8900', '1(817) 569-8900', '+1(817) 569-8900', '+852 6569-8900'];
      validNumbers.forEach( function (num) {
        var converted = routeValidator._before.toE164PhoneNumber(num);
        expect(converted).to.equal(phone(num)[0]);
      });
    });

    it('should return undefined for invalid phone numbers', function () {
      var invalidNumbers = ['6123-6123', 'banana', '876-3133', 8175698900];
      invalidNumbers.forEach( function (num) {
        var converted = routeValidator._before.toE164PhoneNumber(num);
        expect(converted).to.be.undefined;
      });
    });
  });
});