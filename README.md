# copy-cat

A standalone server to mock various communications services for push messaging, email, and sms. `copy-cat` is designed with the idea that while developing, we're constantly running our test suite with watch tasks or manually and hitting these services is often a side-effect of what we're really trying to test.

[![Build Status](https://travis-ci.org/mmerkes/copy-cat.svg)](https://travis-ci.org/mmerkes/copy-cat)
[![Coverage Status](https://coveralls.io/repos/mmerkes/copy-cat/badge.svg?branch=master&service=github)](https://coveralls.io/github/mmerkes/copy-cat?branch=master)

**NOTE: This repository is under active development, so expect to see additions coming in regularly. See [issues](https://github.com/mmerkes/copy-cat/issues) for upcoming features and services.**

## Supported Services

* MailChimp (coming soon)
* Bandwidth / Catapult
* Mailgun
* PushWoosh
* Twilio (coming soon)
* TBD (coming soon)

See below for details on specific APIs supported.

## Basic Usage

With `copy-cat`, you can start a standalone server to mock service endpoints, which can be run locally, deployed to the cloud (AWS, Heroku, etc.), or included in your test suite. While running test suites in development, you can hit mock API endpoints for the purpose of speed, cost, or a lack of support for test endpoints by the actual service.

### Standalone Server

Running a standalone server is handy when you want all developers to hit a mock endpoint.

```javascript
var copycat = require('copy-cat');

// Starts a copy-cat server on the default port with PushWoosh and Mailgun routes available
var app = copycat({
  pushwoosh: {},
  mailgun: {}
});
```

### Running with Test Suite

`copy-cat` can be used directly by your test suite to set up mock API endpoints while running the tests. **NOTE: While these mock APIs are meant to closely resemble behavior of actual APIs, behavior may differ.** In cases where requests are critically invalid, routes send 400s regardless of actual API behavior for convenience. Thus, it is suggested that you test with actual APIs prior to deploying to production, and use `copy-cat` during development only.

```javascript
// messagesController.js
var pw_url;
if (process.env.NODE_ENV === 'development') {
  pw_url = 'http://localhost:8000/pushwoosh/json/1.3';
} else {
  pw_url = 'https://cp.pushwoosh.com/json/1.3';
}

module.exports.postMessage = function (req, res, next) {
  Message.create(req.body, function (err, message) {
    if (err) return next(err);

    // Send push notification to user
    request({
      method: 'POST',
      url: pw_url + '/createMessage',
      json: {
        request: {
          application: conf.get('pw_application'),
          auth: conf.get('pw_apikey'),
          notifications: [{
            send_date: "now",
            ignore_user_timezone: true,
            content: req.body.message,
            devices: [req.recipient.device_id]
          }]
        }
      }
    }, function (err, response, body) {
      if (err) return next(err);

      if (response.statusCode !== 200 || body.status_code !== 200) {
        return next(new Error('Failed to send push notification for message: ' + message._id));
      }

      return next();
    });
  });
};

// test.js
var copycat = require('copy-cat'),
    request = require('supertest'),
    app = require('../server.js');

describe('INTEGRATION /messages', function () {
  var mockServices;
  before( function () {
    if (process.env.NODE_ENV === 'development') {
      // Our controller can now hit http://localhost:8000/pushwoosh/json/1.3/createMessage
      // instead of actual API
      mockServices = copycat({
        port: 8000,
        pushwoosh: {} // Includes PushWoosh routes with default configuration
      });
    }
  });

  describe('POST /messages', function () {
    it('should post a push notification to pushwoosh', function (done) {
      request(app)
        .post('/messages')
        .send({
          message: 'Dude! Great idea.'
        })
        .expect(200, done);
    });
  });
});
```

## Config Object

```javascript
{
  logFormat: 'dev', // Log format string passed into Morgan. Defaults to 'dev'.
  port: 3001, // Optional. Port to run server on. Defaults to 3001.
  startServer: true, // Optional. If true, will start server to listen on specified
  // port or default port. If false, will not start server. Useful for testing.
  bandwidth: {

  },
  pushwoosh: { // optional, will not run mock pushwoosh service if undefined
    application: ["APPLICATION_CODE"], // optional, checks for code match if set
    auth: ["API_ACCESS_TOKEN"], // optional, checks for token match if set
    devices: ["DEVICE_TOKEN"], // optional, checks for device match if set on /createMessage
    messages: ["MESSAGE_CODE"], // optional, checks for message match if set on /deleteMessage
  },
  mailgun: { // optional, will not run mock mailgun service if undefined
    domains: ['DOMAIN_NAME'], // optional, will invalidate any requests on domains that don't match
    apiKeys: ['API_KEY'], // optional, will send 401 if present and API key doesn't match
    // NOTE: apiKeys must be base64 string represention, i.e. MXBpOmpleS0xZDF4c3J6YMNmdGNuZjYtb2BxN2FpaTZqcWsyb25yOB==
    versions: ['VERSION'], // optional, will invalidate any versions not matching if present. Defaults to ['v2', 'v3']
  }
}
```

## Supported APIs

### <a name="catapult"></a>Bandwidth / Catapult

* [POST /v1/users/{userId}/messages](http://ap.bandwidth.com/docs/rest-api/messages/#resourcePOSTv1usersuserIdmessages)
* [GET /v1/users/{userId}/messages/{messageId}](http://ap.bandwidth.com/docs/rest-api/messages/#resourceGETv1usersuserIdmessagesmessageId)

### <a name="mailchimp"></a>MailChimp (coming soon)

### <a name="mailgun"></a>Mailgun

* [POST /messages](https://documentation.mailgun.com/api-sending.html#sending)
* More forthcoming


### <a name="pushwoosh"></a>PushWoosh

* [/createMessage](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-Method-messages-create)
* [/deleteMessage](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-Method-messages-delete)
* [/registerDevice](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-MethodRegister)
* [/unregisterDevice](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-MethodUnregister)
* More forthcoming

### <a name="twilio"></a>Twilio (coming soon)

### TBD (coming soon)

## Contributing

Contributions are always welcome! If you find bugs, open an issue on the [github repo](https://github.com/mmerkes/copy-cat/issues). Extra points for a pull request fixing the bug! All bug fixes must include testing to get the PR accepted. Please follow the style conventions in the code. If you have ideas for enhancements, make sure an issue is not already created and if not, open an [issue](https://github.com/mmerkes/copy-cat/issues) to put it up for discussion.

## License

The MIT License (MIT)

Copyright (c) 2015 Matt Merkes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.