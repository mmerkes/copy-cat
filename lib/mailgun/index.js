'use strict';

var express = require('express'),
    routeValidator = require('express-route-validator'),
    validator = require('validator');

module.exports = function (config) {
  require('./validators')(config);

  var router = express.Router();

  /*
    TODO:
      1. (optional) Send a 401 instead of 400 if invalid auth. Worthwhile or 400 is good?
  */

  router.post('/:version/:domain/messages', routeValidator.validate({
    body: {
      from: { isRequired: true, isMailgunEmail: true },
      to: { isRequired: true, isMailgunEmails: true }
    },
    params: {
      version: { isRequired: true, isIn: config.versions || ['v2', 'v3'] },
      domain: { isRequired: true, isMailgunDomain: true }
    },
    headers: {
      authorization: { isRequired: true, isMailgunApiKey: true },
      'content-type': { isRequired: true, equals: 'application/x-www-form-urlencoded' }
    }
  }), function (req, res) {
    if (req.body['recipient-variables'] && !validator.isJSON(req.body['recipient-variables'])) {
      return res.status(400).send({
        message: "'recipient-variables' parameter is not a valid JSON"
      });
    }
    if (!req.body.text && !req.body.html) {
      return res.status(400).send({
        message: "Need at least one of 'text' or 'html' parameters specified"
      });
    }
    return res.status(200).send({
      id: '<' + Math.random() + '@' + req.params.domain + '>',
      message: 'Queued. Thank you.'
    });
  });

  router.use('/', router);

  return router;
};