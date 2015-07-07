'use strict';

var port = 3001;

module.exports.getNextPort = function () {
  port++;
  return port;
};