# Chattrix Backend

RESTful API server with real-time WebSocket support built with Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **Auth:** JWT, bcrypt
- **Validation:** express-validator

## ✨ Features

- JWT authentication
- Real-time messaging via Socket.io
- User management & search
- Chat & message CRUD
- Rate limiting
- Error handling middleware
- MongoDB connection pooling

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

**Required Environment Variables:**
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - CORS origin (optional)

## 📡 API Endpoints

**Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`  
**Users:** `/api/users`, `/api/users/:id`, `/api/users/profile`  
**Chats:** `/api/chats`, `/api/chats/:chatId`  
**Messages:** `/api/messages/:chatId`, `/api/messages`

## 🔌 Socket.io Events

**Client → Server:** `join-chat`, `send-message`, `typing-start`, `typing-stop`, `mark-read`  
**Server → Client:** `receive-message`, `typing-start`, `typing-stopped`, `message-read`, `user-online`, `user-offline`

## 🏗️ Architecture

- **MVC Pattern** - Separation of concerns
- **Middleware** - Auth, validation, error handling, rate limiting
- **Clean Code** - Consistent response format, error handling

## 📄 License

MIT
