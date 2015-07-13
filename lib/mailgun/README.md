### POST /<domain>/messages API Example Responses

```javascript
// On success
{
  "id": "<20150710012507.119589.3986@test.myneighbor.com>",
  "message": "Queued. Thank you."
}
// On multiple recipients
{
  "id": "<20150710012556.3369.55978@test.myneighbor.com>",
  "message": "Queued. Thank you."
}
// On no/invalid auth
// 401
"Forbidden"
// On invalid version
// 404
"<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">\n<title>404 Not Found</title>\n<h1>Not Found</h1>\n<p>The requested URL was not found on the server.</p><p>If you entered the URL manually please check your spelling and try again.</p>\n"
// On application/json
// 400
{
  "message": "'from' parameter is missing"
}
// On no from
// 400
{
  "message": "'from' parameter is missing"
}
// On invalid from
// 400
{
  "message": "'from' parameter is not a valid address. please check documentation"
}
// On no to
// 400
{
  "message": "'to' parameter is missing"
}
// On invalid to
// 400
{
  "message": "'to' parameter is not a valid address. please check documentation"
}
// On no subject
{
  "id": "<20150710014050.66728.71180@test.myneighbor.com>",
  "message": "Queued. Thank you."
}
// On no content
// 400
{
  "message": "Need at least one of 'text' or 'html' parameters specified"
}
// On recipient variables not being JSON
// 400
{
  "message": "'recipient-variables' parameter is not a valid JSON"
}
```

### GET domains/<domain>/messages API Example Responses

### DELETE domains/<domain>/messages/<message> API Example Responses