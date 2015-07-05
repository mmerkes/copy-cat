
### METHOD /createMessage API Example Responses

```javascript
// On success
{
  "status_code": 200,
  "status_message": "OK",
  "response": {
    "Messages": [
      "CODE_NOT_AVAILABLE"
    ]
  }
}
// On bad application code
{
  "status_code": 210,
  "status_message": "Application not found",
  "response": null
}
// On bad auth token
{
  "status_code": 210,
  "status_message": "Account not found",
  "response": null
}
// On no notifications
{
  "status_code": 210,
  "status_message": "No notifications",
  "response": null
}
// Empty notifications array
{
  "status_code": 200,
  "status_message": "OK",
  "response": {
    "Messages": []
  }
}
// Unknown device
{
  "status_code": 200,
  "status_message": "OK",
  "response": {
    "Messages": [
      "CODE_NOT_AVAILABLE"
    ],
    "UnknownDevices": {
      "": [
        "e5397eb5054d9d"
      ]
    }
  }
}
// Bad param
{
  "status_code": 210,
  "status_message": "android_root_params must be key-value object",
  "response": null
}
// No send date
{
  "status_code": 210,
  "status_message": "Cannot parse date",
  "response": null
}
// Bad send date
{
  "status_code": 210,
  "status_message": "Cannot parse date",
  "response": null
}
// No ignore user timezone
{
  "status_code": 200,
  "status_message": "OK",
  "response": {
    "Messages": [
      "CODE_NOT_AVAILABLE"
    ]
  }
}
// No content
{
  "status_code": 200,
  "status_message": "OK",
  "response": {
    "Messages": [
      "CODE_NOT_AVAILABLE"
    ]
  }
}
```

### Method /deleteMessage API Example Response

```javascript
// On success
{
  "status_code": 200,
  "status_message": "OK"
}

// No auth token
{
  "status_code": 210,
  "status_message": "API token or application is not set",
  "response": null
}

// Bad auth token
{
  "status_code": 210,
  "status_message": "Account not found",
  "response": null
}

// No message property
{
  "status_code": 210,
  "status_message": "Message not found",
  "response": null
}

// No message match
{
  "status_code": 210,
  "status_message": "Message not found",
  "response": null
}

### Method /registerDevice API Example Response

```javascript
// On success
{
  "status_code": 200,
  "status_message": "OK"
  "response": null
}
// On bad application code
{
  "status_code": 210,
  "status_message": "Application not found",
  "response": null
}
// On no push token
{
  "status_code": 210,
  "status_message": "No push token given",
  "response": null
}
// On invalid push token
{
  "status_code": 210,
  "status_message": "Invalid token: 1234",
  "response": null
}
// On no hwid
{
  "status_code": 210,
  "status_message": "No hwid given",
  "response": null
}
// On invalid timezone
{
  "status_code": 200,
  "status_message": "OK",
  "response": null
}
// On no device_type
{
  "status_code": 210,
  "status_message": "Invalid device type",
  "response": null
}
// On bad device_type
{
  "status_code": 210,
  "status_message": "Invalid device type",
  "response": null
}
```