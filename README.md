# copy-cat

A standalone server to mock various communications services for push messaging, email, and sms.

**NOTE: This repository is under active development, so expect to see additions coming in regularly.**

## Config Object

```javascript
{
  logFormat: 'dev', // Log format string passed into Morgan. Defaults to 'dev'.
  port: 3001, // Port to run server on. Defaults to 3001.
  pushwhoosh: { // optional, will not run mock pushwhoosh service if undefined
    application: ["APPLICATION_CODE"], // optional, checks for code match if set
    auth: ["API_ACCESS_TOKEN"], // optional, checks for token match if set
    devices: ["DEVICE_TOKEN"] // optional, checks for device match if set
  }
}
```

## Supported APIs

### PushWhoosh

* [/createMessage](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-Method-messages-create)
* [/deleteMessage](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-Method-messages-delete) (coming soon)
* [/registerDevice](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-MethodRegister) (coming soon)
* [/unregisterDevice](https://www.pushwoosh.com/programming-push-notification/pushwoosh-push-notification-remote-api/#PushserviceAPI-MethodUnregister) (coming soon)

### Mailgun

* [POST /messages](https://documentation.mailgun.com/api-sending.html#sending) (coming soon)
* More forthcoming

### Twilio (coming soon)