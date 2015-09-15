### POST /v1/users/:user/messages

#### Single Message

```javascript
// Example Request
var request = require('request');

request({
  method: 'POST',
  url: 'https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages',
  auth: {
    user: "a-ascc4wo4zyq7as366hxkhas",
    password: "ascoslxnasalqfbtashrkxasz545jdtkrcb2zas"
  },
  json: {
    from: "+14155791234",
    to: "+19713131234",
    text: "Test duder"
  }
}, function (err, res, body) {

});

// On success
// 201
{
  "cache-control": "no-cache",
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:32:25 GMT",
  "location": "https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages/m-lkb6bomtaz7z2rauff3h6by",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "0",
  "connection": "keep-alive"
}
undefined

// On missing field
// 400
{
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:51:40 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "313",
  "connection": "keep-alive"
}
{
  "category": "bad-request",
  "code": "missing-property",
  "message": "The 'message' resource property 'text' is required but was not specified",
  "details": [
    {
      "name": "requestMethod",
      "value": "POST"
    },
    {
      "name": "remoteAddress",
      "value": "50.248.205.150"
    },
    {
      "name": "requestPath",
      "value": "users/a-b5h4y5x6vcw5aszyyzsmsas/messages"
    }
  ]
}

// On invalid 'from', either invalid format or number not configured in app
{
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:52:54 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "422",
  "connection": "keep-alive"
}
{
  "category": "authorization",
  "code": "number-access-denied",
  "message": "User a-b5h4y5x6vcw5aszyyzsmsas does not have permission to use number +1415579029",
  "details": [
    {
      "name": "userId",
      "value": "a-b5h4y5x6vcw5aszyyzsmsas"
    },
    {
      "name": "number",
      "value": "+1415579029"
    },
    {
      "name": "requestMethod",
      "value": "POST"
    },
    {
      "name": "remoteAddress",
      "value": "50.248.205.150"
    },
    {
      "name": "requestPath",
      "value": "users/a-b5h4y5x6vcw5aszyyzsmsas/messages"
    }
  ]
}

// On invalid user, token, or secret
// 401
{
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:54:00 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "322",
  "connection": "keep-alive"
}
{
  "category": "authorization",
  "code": "access-denied",
  "message": "The authenticated user does not have sufficient permissions to access this resource",
  "details": [
    {
      "name": "requestMethod",
      "value": "POST"
    },
    {
      "name": "remoteAddress",
      "value": "50.248.205.150"
    },
    {
      "name": "requestPath",
      "value": "users/a-b5h4y5x6vcw5aszyyzsmsa/messages"
    }
  ]
}

// On text > 2048 characters
{
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:56:21 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "290",
  "connection": "keep-alive"
}
{
  "category": "bad-request",
  "code": "validation-error",
  "message": "The message text must be 2,048 characters or less",
  "details": [
    {
      "name": "requestMethod",
      "value": "POST"
    },
    {
      "name": "remoteAddress",
      "value": "50.248.205.150"
    },
    {
      "name": "requestPath",
      "value": "users/a-b5h4y5x6vcw5aszyyzsmsas/messages"
    }
  ]
}
```

#### Multiple Messages

```javascript
// Example Request
var request = require('request');

request({
  method: 'POST',
  url: 'https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages',
  auth: {
    user: "a-ascc4wo4zyq7as366hxkhas",
    password: "ascoslxnasalqfbtashrkxasz545jdtkrcb2zas"
  },
  json: [{
    from: "+14155791234",
    to: "+19713131234",
    text: "Test duder"
  }, {
    from: "+14155791234",
    to: "+19713131234",
    text: "Test dudes"
  }]
}, function (err, res, body) {

});

// On success 
{
  "cache-control": "no-cache",
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 22:03:48 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "279",
  "connection": "keep-alive"
}
[
  {
    "result": "accepted",
    "location": "https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages/m-krxus6bctn25q62nfklopfq"
  },
  {
    "result": "accepted",
    "location": "https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages/m-lta4zvpivsm4ejnw5wytmba"
  }
]

// On split success and failure
{
  "cache-control": "no-cache",
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 22:06:03 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "316",
  "connection": "keep-alive"
}
[
  {
    "result": "accepted",
    "location": "https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages/m-gickicq52tfn2dvraggkdfa"
  },
  {
    "result": "error",
    "error": {
      "category": "bad-request",
      "code": "missing-property",
      "message": "The 'message' resource property 'to' is required but was not specified",
      "details": []
    }
  }
]
```

### GET /v1/users/:user/messages/:message

```javascript
// Example Request
request({
  method: 'GET',
  url: "https://api.catapult.inetwork.com/v1/users/a-b5h4y5x6vcw5aszyyzsmsas/messages/m-i2c5jvxizg6wn466iemkxrq",
  auth: {
    user: "a-ascc4wo4zyq7as366hxkhas",
    password: "ascoslxnasalqfbtashrkxasz545jdtkrcb2zas"
  },
  json: true
}, function (err, res, body) {

});

// On success
// 200
{
  "cache-control": "no-cache",
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:40:08 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "243",
  "connection": "keep-alive"
}
{
  "direction": "out",
  "from": "+14155791234",
  "id": "m-i2c5jvxizg6wn466iemkxrq",
  "messageId": "m-i2c5jvxizg6wn466iemkxrq",
  "state": "sent",
  "text": "Test duder",
  "media": [],
  "time": "2015-09-14T21:28:35Z",
  "to": "+19713131234",
  "skipMMSCarrierValidation": false
}

// On success, receiptRequested set to 'all'
{
  "cache-control": "no-cache",
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:38:44 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "368",
  "connection": "keep-alive"
}
{
  "direction": "out",
  "from": "+14155791234",
  "id": "m-lkb6bomtaz7z2rauff3h6by",
  "messageId": "m-lkb6bomtaz7z2rauff3h6by",
  "state": "sent",
  "text": "Test duder",
  "media": [],
  "time": "2015-09-14T21:32:25Z",
  "to": "+19713131234",
  "skipMMSCarrierValidation": false,
  "receiptRequested": "all",
  "deliveryState": "delivered",
  "deliveryCode": "0",
  "deliveryDescription": "Message delivered to carrier"
}

// On invalid message
// 404
{
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:41:03 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "transfer-encoding": "chunked",
  "connection": "keep-alive"
}
{
  "category": "not-found",
  "code": "message-not-found",
  "message": "The message 'm-i2c5jvxizg6wn466iemkxq' could not be found",
  "details": [
    {
      "name": "messageId",
      "value": "m-i2c5jvxizg6wn466iemkxq"
    },
    {
      "name": "requestMethod",
      "value": "GET"
    },
    {
      "name": "remoteAddress",
      "value": "50.248.205.150"
    },
    {
      "name": "requestPath",
      "value": "users/a-b5h4y5x6vcw5aszyyzsmsas/messages/m-i2c5jvxizg6wn466iemkxq"
    }
  ]
}

// On invalid user, token, or secret
// 401
{
  "content-type": "application/json",
  "date": "Mon, 14 Sep 2015 21:42:12 GMT",
  "server": "Jetty(8.1.10.v20130312)",
  "content-length": "347",
  "connection": "keep-alive"
}
{
  "category": "authorization",
  "code": "access-denied",
  "message": "The authenticated user does not have sufficient permissions to access this resource",
  "details": [
    {
      "name": "requestMethod",
      "value": "GET"
    },
    {
      "name": "remoteAddress",
      "value": "50.248.205.150"
    },
    {
      "name": "requestPath",
      "value": "users/a-b5h4y5x6vcw5aszyyzsmsa/messages/m-i2c5jvxizg6wn466iemkxrq"
    }
  ]
}
```