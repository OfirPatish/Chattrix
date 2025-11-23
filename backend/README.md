# Chattrix Backend

RESTful API server with real-time WebSocket support built with Node.js, Express, and MongoDB.

## 🚀 Tech Stack

**Runtime:** Node.js  
**Framework:** Express.js  
**Database:** MongoDB with Mongoose  
**Real-time:** Socket.io  
**Authentication:** JWT, bcrypt  
**Validation:** express-validator

## ✨ Key Features

- JWT authentication with secure password hashing
- Real-time messaging via Socket.io
- User management & search functionality
- Chat & message CRUD operations
- Rate limiting for API protection
- Comprehensive error handling middleware
- MongoDB connection pooling

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB database (local or Atlas)

### Setup
```bash
npm install
cp .env.example .env
# Configure .env with MONGO_URL, JWT_SECRET, PORT=3000, FRONTEND_URL
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

## 📁 Project Structure

```
backend/
├── config/          # Configuration files (CORS, database, socket)
├── controllers/     # Route controllers
├── middleware/      # Auth, validation, error handling, rate limiting
├── models/          # Mongoose models
├── routes/          # API routes
├── socket/          # Socket.io handlers
└── utils/           # Utility functions
```

## 🔒 Security & Validation

- JWT-based authentication with password hashing
- Input validation and sanitization
- Rate limiting and CORS protection
- MongoDB injection prevention (Mongoose)
- Error handling middleware
