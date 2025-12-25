# API Reference Guide

Technical reference for frontend integration with the Chattrix backend API.

## 🔐 Authentication

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "data:image/svg+xml;base64,...",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**

- Username: 3-20 characters
- Email: Valid email format
- Password: Min 8 chars, must contain uppercase, lowercase, and number

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "...",
    "isOnline": true,
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "...",
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 👥 Users

### Get All Users (Search)

```http
GET /api/users?search=john&page=1&limit=20
Authorization: Bearer <accessToken>
```

**Query Parameters:**

- `search` (optional): Search query (max 100 chars)
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 20, min: 1, max: 100)

**Response (200):**

```json
{
  "success": true,
  "page": 1,
  "pages": 5,
  "total": 100,
  "count": 20,
  "data": [
    {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "...",
      "isOnline": true,
      "lastSeen": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get User by ID

```http
GET /api/users/:id
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "...",
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "username": "newusername",  // optional
  "avatar": "data:image/svg+xml;base64,..."  // optional
}
```

**Validation:**

- Username: 3-20 characters (if provided)
- Avatar: Max 10000 characters (if provided)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "newusername",
    "email": "john@example.com",
    "avatar": "...",
    "isOnline": true,
    "lastSeen": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 💬 Chats

### Get All Chats

```http
GET /api/chats
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "participants": [
        {
          "_id": "...",
          "username": "johndoe",
          "email": "john@example.com",
          "avatar": "...",
          "isOnline": true
        },
        {
          "_id": "...",
          "username": "janedoe",
          "email": "jane@example.com",
          "avatar": "...",
          "isOnline": false
        }
      ],
      "lastMessage": {
        "_id": "...",
        "content": "Hello!",
        "sender": {
          "_id": "...",
          "username": "johndoe",
          "avatar": "..."
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "messageType": "text"
      },
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create or Get Chat

```http
POST /api/chats
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (201 if new, 200 if existing):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "participants": [...],
    "lastMessage": null,
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**

- `400`: Cannot create chat with yourself
- `404`: User not found
- `400`: Invalid user ID format

### Get Chat by ID

```http
GET /api/chats/:chatId
Authorization: Bearer <accessToken>
```

**Response (200):** Same format as Get All Chats (single object)

**Errors:**

- `404`: Chat not found or access denied

## 📨 Messages

### Get Messages

```http
GET /api/messages/:chatId?page=1&limit=50
Authorization: Bearer <accessToken>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 50, min: 1, max: 100)

**Response (200):**

```json
{
  "success": true,
  "page": 1,
  "pages": 10,
  "total": 500,
  "count": 50,
  "data": [
    {
      "_id": "...",
      "content": "Hello!",
      "sender": {
        "_id": "...",
        "username": "johndoe",
        "email": "john@example.com",
        "avatar": "..."
      },
      "chat": "...",
      "messageType": "text",
      "imageUrl": "",
      "readBy": [
        {
          "user": "...",
          "readAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note:** Messages are returned in chronological order (oldest first)

### Create Message

```http
POST /api/messages
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "chatId": "507f1f77bcf86cd799439011",
  "content": "Hello, how are you?",
  "messageType": "text",  // optional: "text" | "image" | "file"
  "imageUrl": ""  // optional: max 2048 chars
}
```

**Validation:**

- `chatId`: Required, valid MongoDB ObjectId
- `content`: Required, max 5000 characters, cannot be empty
- `messageType`: Optional, must be "text", "image", or "file"
- `imageUrl`: Optional, max 2048 characters

**Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "content": "Hello, how are you?",
    "sender": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "..."
    },
    "chat": "...",
    "messageType": "text",
    "imageUrl": "",
    "readBy": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Mark Message as Read

```http
PUT /api/messages/:messageId/read
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Message marked as read"
}
```

**Errors:**

- `404`: Message not found
- `403`: Access denied (not a participant)

## 🔌 Socket.io Events

### Connection

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    token: "<accessToken>",
  },
});
```

### Client → Server Events

**Join Chat Room**

```javascript
socket.emit("join-chat", chatId);
```

**Send Message**

```javascript
socket.emit("send-message", {
  chatId: "...",
  content: "Hello!",
  messageType: "text", // optional
  imageUrl: "", // optional
});
```

**Typing Start**

```javascript
socket.emit("typing-start", {
  chatId: "...",
});
```

**Typing Stop**

```javascript
socket.emit("typing-stop", {
  chatId: "...",
});
```

**Mark Message as Read**

```javascript
socket.emit("mark-read", {
  messageId: "...",
});
```

### Server → Client Events

**Receive Message**

```javascript
socket.on("receive-message", (message) => {
  // message object same as POST /api/messages response
});
```

**Typing Start**

```javascript
socket.on("typing-start", (data) => {
  // { userId: '...', username: '...' }
});
```

**Typing Stopped**

```javascript
socket.on("typing-stopped", (data) => {
  // { userId: '...', username: '...' }
});
```

**Message Read**

```javascript
socket.on("message-read", (data) => {
  // { messageId: '...', userId: '...' }
});
```

**User Online**

```javascript
socket.on("user-online", (data) => {
  // { userId: '...', isOnline: true }
});
```

**User Offline**

```javascript
socket.on("user-offline", (data) => {
  // { userId: '...', isOnline: false }
});
```

**Error**

```javascript
socket.on("error", (data) => {
  // { message: 'Error message' }
});
```

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (invalid/missing token, expired token)
- `403` - Forbidden (access denied)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate username/email)
- `422` - Validation Error
- `500` - Internal Server Error

### Error Examples

**Validation Error (400):**

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Username must be between 3 and 20 characters",
      "param": "username",
      "location": "body"
    }
  ]
}
```

**Unauthorized (401):**

```json
{
  "success": false,
  "message": "Not authorized, token expired"
}
```

**Not Found (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Conflict (409):**

```json
{
  "success": false,
  "message": "Username already taken"
}
```

## 🔑 Authentication Headers

All protected routes require:

```http
Authorization: Bearer <accessToken>
```

## 📄 Pagination

Pagination is used for:

- `GET /api/users` (search users)
- `GET /api/messages/:chatId` (get messages)

**Response Format:**

```json
{
  "success": true,
  "page": 1,        // Current page
  "pages": 10,      // Total pages
  "total": 500,     // Total items
  "count": 50,      // Items in current page
  "data": [...]     // Array of items
}
```

**Query Parameters:**

- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default varies, min: 1, max: 100)

## 📝 Notes

1. **Token Expiration:**

   - Access Token: 15 minutes
   - Refresh Token: 7 days

2. **Message Order:**

   - Messages are returned in chronological order (oldest first)
   - Use `sort` on frontend if reverse order needed

3. **Real-time Updates:**

   - Use Socket.io for real-time message delivery
   - REST API for initial load and pagination

4. **Avatar Format:**

   - Avatars are SVG data URIs (base64 encoded)
   - Format: `data:image/svg+xml;base64,...`
   - Max length: 10000 characters

5. **Search:**

   - User search is case-insensitive
   - Searches both username and email
   - Max query length: 100 characters

6. **Rate Limiting:**

   - Auth endpoints: 5 requests per 15 minutes
   - General API: 100 requests per 15 minutes

7. **CORS:**
   - Configured via `FRONTEND_URL` environment variable
   - Set in backend `.env` file
