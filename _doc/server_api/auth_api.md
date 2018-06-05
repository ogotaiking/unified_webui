# Authentication API


## login

* URL : /auth/login
* Method: POST
* Example Request JSON :


```json
{ 
    "userid" : "username/email/phone",
    "password" : "your password",
    "clientfp" : "fingerprint"
}
```

* Successful Response JSON:

```json
{
    "uid" : "userid",
    "status": "success",
    "token": "JWT xxxxg",
    "username": "name",
    "email": "foo@foo.com",
    "phone": "135xxxxx",
    "locale": "en",
    "role": "viewer",
    "privilegeLevel": 0
}
```

Note:  Token could be used for CSRF/GraphQL or other API authentication.\
System may request both Session-cookie and Token authentication.

* Error Response JSON:

```json
{
    "status": "error",
    "errcode": "401",
    "errmsg": "Detailed Error Msg"
}
```
***
## logout

* URL : /auth/logout
* Method: POST
* Header

```json
"Authorization" : "JWT xxxx" <-token string.
```
* Example Request JSON :

```json
{
    "clientfp" : "fingerprint"
}
```

* Successful Response JSON:

```json
{
    "status": "success",
    "message": "logout successfully"
}
```

* Error Response JSON:

```json
{
    "status": "error",
    "errcode": "401",
    "errmsg": "Unauthorized Logout"
}
```

***
## register

* URL : /auth/register
* Method: POST
* Example Request JSON :

```json
{ 
    "username" : "username",
    "email"    : "email",
    "phone"    : "phone number",
    "password" : "your password"
}
```

* Successful Response JSON:

```json
{
    "uid" : "userid",
    "status": "success",
    "token": "JWT xxxxg",
    "username": "name",
    "email": "foo@foo.com",
    "phone": "135xxxxx",
    "locale": "en",
    "role": "viewer",
    "privilegeLevel": 0
}
```

Note:  Token could be used for CSRF/GraphQL or other API authentication.
System may request both Session-cookie and Token authentication.

* Error Response JSON:

```json
{
    "status": "error",
    "errcode": "401",
    "errmsg": "Detailed Error Msg"
}
```

***
## token

* URL : /auth/token
* Method: POST
* Example Request JSON :

```json
{ 
    "userid" : "username/email/phone",
    "password" : "your password"
}
```

* Successful Response JSON:

```json
{
    "uid" : "userid",
    "status": "success",
    "token": "JWT xxxxg",
    "username": "name",
    "email": "foo@foo.com",
    "phone": "135xxxxx",
    "locale": "en",
    "role": "viewer",
    "privilegeLevel": 0
}
```

Note:  Token auth function will not trigger server session-cookie, 
This API is just used for some one who wants to design pure restapi .

* Error Response JSON:

```json
{
    "status": "error",
    "errcode": "401",
    "errmsg": "Detailed Error Msg"
}
```
