# Chattrix Backend API

A scalable RESTful API with real-time WebSocket support for a modern chat application. Built with Node.js, Express, and MongoDB following industry best practices.

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.io with Redis adapter
- **Authentication:** JWT (access + refresh tokens), bcrypt
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate limiting, input sanitization
- **Logging:** Pino (structured logging)
- **Testing:** Jest with MongoDB Memory Server

## ✨ Key Features

- **Authentication & Authorization:** JWT-based auth with refresh tokens, password hashing, token blacklisting
- **Real-time Communication:** Socket.io for instant messaging, typing indicators, online status
- **RESTful API:** Clean REST endpoints with proper HTTP status codes and error handling
- **Data Validation:** Comprehensive input validation at route and model levels
- **Error Handling:** Centralized error handling with custom error classes
- **Code Organization:** Modular architecture with separation of concerns (routes → controllers → services → models)
- **Security:** Rate limiting, CORS protection, MongoDB injection prevention, input sanitization
- **Performance:** Connection pooling, query optimization, response compression

## 🏗️ Architecture

```
backend/
├── config/          # Database, CORS, Socket.io configuration
├── controllers/     # HTTP request handlers (thin layer)
├── services/        # Business logic layer
├── models/          # Mongoose schemas and models
├── routes/          # Express route definitions
├── middleware/      # Auth, validation, error handling, rate limiting
├── validators/      # Reusable validation rules
├── errors/          # Custom error classes
├── utils/           # Shared utilities (pagination, responses, validators)
└── socket/          # Socket.io event handlers
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set: MONGO_URL, JWT_SECRET, PORT, FRONTEND_URL

# Development
npm run dev

# Production
npm start

# Run tests
npm test
```

## 📡 API Endpoints

**Authentication:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/refresh`, `POST /api/auth/logout`  
**Users:** `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/profile`  
**Chats:** `GET /api/chats`, `POST /api/chats`, `GET /api/chats/:chatId`  
**Messages:** `GET /api/messages/:chatId`, `POST /api/messages`, `PUT /api/messages/:messageId/read`

## 🔌 Socket.io Events

**Client → Server:** `join-chat`, `send-message`, `typing-start`, `typing-stop`, `mark-read`  
**Server → Client:** `receive-message`, `typing-start`, `typing-stopped`, `message-read`, `user-online`, `user-offline`

## 🧪 Testing

- **Coverage:** 71%+ statement coverage
- **Test Types:** Unit tests (services, utils), integration tests (API endpoints), middleware tests
- **Test Environment:** MongoDB Memory Server for isolated testing
- **Run Tests:** `npm test` (with coverage) or `npm run test:watch`

## 🔒 Security Features

- JWT authentication with secure token management
- Password hashing using bcrypt
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS protection
- MongoDB injection prevention
- Error message sanitization in production

## 📦 Key Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `express-validator` - Input validation
- `helmet` - Security headers
- `pino` - High-performance logging
- `jest` - Testing framework

## 🎯 Best Practices Implemented

- **DRY Principle:** Reusable validators, utilities, and error classes
- **Separation of Concerns:** Clear layer separation (routes → controllers → services)
- **Error Handling:** Custom error classes with proper HTTP status codes
- **Code Organization:** Modular structure with single responsibility principle
- **API Design:** RESTful conventions with consistent response formats
- **Security:** Multiple layers of protection and validation
- **Performance:** Optimized queries, connection pooling, compression

---

**Author:** Ofir Patish  
**License:** MIT
