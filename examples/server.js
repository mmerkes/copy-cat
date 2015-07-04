'use strict';

var app = require('../index')({
  port: 3001,
  pushwhoosh: {
    application: ['A91GE-ABD43'],
    auth: ['F5ZO2NtuDy4L1c5j3y1Qd52yMoEOj51z5Ma2tDtz1QqzUeEIXGtKGltn53bp3hG33L1lXZVTzKL4zX5NukBe'],
    devices: ["477A3B81-EAC1-4174-938D-180E6ECB0B39"]
  }
});