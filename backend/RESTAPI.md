## Login

**Endpoint:** `/email/login/`
**Method:** POST
**Authentication:** Unauthenticated
**Request Body:**

- `username` (string): The user's email address.
- `password` (string): The user's password.

**Example Request:**

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

## Register

**Endpoint:** `/register/`  
**Method:** POST  
**Authentication:** Unauthenticated  
**Request Body:**

- `email` (string): The user's email address.
- `password` (string): The user's password.
- `confirmPassword` (string): The user's password confirmation.
- `firstName` (string): The user's first name.
- `lastName` (string): The user's last name.

**Example Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Fetch Conversations

**Endpoint:** `/get/conversations/`  
**Method:** GET  
**Authentication:** Authenticated

**Example Request:**

```json
{}
```

## Send Chat

**Endpoint:** `/chat/send/`  
**Method:** POST  
**Authentication:** Authenticated  
**Request Body:** (dynamic)

**Example Request:**

```json
{
  "conversation": 21, //optional conversation id
  "prompt": "My message",
  "config": {
		"llm": "OPEN_AI",
		"chat_model": "gpt-4-turbo",
	}
	"system_instructions": "Talk like a pirate.",
}
```

## Fetch Profile Data

**Endpoint:** `/api/user/`  
**Method:** GET  
**Authentication:** Authenticated

**Example Request:**

```json
{}
```

## Reset Password

**Endpoint:** `/forgot-password/`  
**Method:** POST  
**Authentication:** Unauthenticated  
**Request Body:**

- `email` (string): The user's email address.

**Example Request:**

```json
{
  "email": "user@example.com"
}
```

## Update Settings

**Endpoint:** `/api/user/`  
**Method:** PUT  
**Authentication:** Authenticated  
**Request Body:** (dynamic)

- Any JSON object representing the user's settings to be updated.

**Example Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "metadata": {
    //any custom data for your application
  }
}
```

## Change Password

**Endpoint:** `/api/change-password/`  
**Method:** POST  
**Authentication:** Authenticated  
**Request Body:**

- `currentPassword` (string): The user's current password.
- `newPassword` (string): The user's new password.
- `confirmNewPassword` (string): Confirmation of the user's new password.

**Example Request:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmNewPassword": "newpassword123"
}
```
