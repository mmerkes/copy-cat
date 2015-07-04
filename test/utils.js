'use strict';

var port = 3000;

module.exports.getNextPort = function () {
  port++;
  return port;
};