'use strict';

module.exports = function (config) {
  var express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      version = require('../package').version;

  app.use(bodyParser.json());
  app.use(morgan(config.logFormat || 'dev'));

  // If pushwhoosh is configured, add the routes
  if (config.pushwhoosh) {
    app.use('/pushwhoosh', require(__dirname + '/pushwhoosh/index.js')(config.pushwhoosh));
  }

  app.get('/version', function (req, res) {
    return res.status(200).json({
      version: version,
      activePlatforms: {
        pushwhoosh: !!config.pushwhoosh
      }
    });
  });

  app.use(function (req, res) {
    return res.status(404).send('Route not supported');
  });

  var server = app.listen(config.port || 3001, function () {
    console.log('copy-cat server now listening at http://%s:%s',
      server.address().address, server.address().port);
  });

  return app;
};