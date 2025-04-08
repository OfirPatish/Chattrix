# 🔧 Chattrix Backend

This is the server-side implementation for the Chattrix real-time chat application.

## 🛠️ Technologies Used

- 📡 Node.js & Express for the server
- 🗃️ MongoDB for database
- 🔐 JWT for authentication
- ⚡ Socket.io for real-time communication
- 🛡️ Helmet for security headers
- 🚧 Rate limiting for API protection
- 🔍 Morgan for request logging
- 🗜️ Compression for response optimization

## 📂 Project Structure

- `controllers/` - Request handlers
  - `authController.js` - Authentication logic
  - `messageController.js` - Message handling logic
- `models/` - Database schemas
  - `User.js` - User model
  - `Message.js` - Message model
- `routes/` - API endpoints
  - `authRoute.js` - Authentication routes
  - `messageRoute.js` - Message routes
  - `healthRoute.js` - System health monitoring
- `middleware/` - Custom middleware
  - `authMiddleware.js` - JWT verification
  - `errorHandler.js` - Global error handling
  - `securityMiddleware.js` - API rate limiting and headers
- `lib/` - Utility functions
  - `database.js` - Database connection
  - `socket.js` - Socket.io implementation
- `config/` - Application configuration
  - `appConfig.js` - Server settings

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Messages

- `GET /api/messages/:userId` - Get messages with a specific user
- `POST /api/messages` - Send a new message

### System

- `GET /health` - Check API health status

## 🔒 Security Features

- Helmet for secure HTTP headers
- Rate limiting to prevent abuse
- CORS configured for frontend access
- JWT for secure authentication
- Cookie security for token storage
- Input validation and sanitization

## 📋 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Setup

1. Install dependencies

   ```
   npm install
   ```

2. Set up environment variables in `.env` file

   ```
   # Database
   MONGO_URL=your_mongodb_connection_string

   # Server
   PORT=5000
   NODE_ENV=development

   # Authentication
   JWT_SECRET=your_jwt_secret

   # External Services
   IMGBB_API_KEY=your_imgbb_api_key

   # Client
   CLIENT_URL=http://localhost:5173
   ```

### Development

```
npm run dev
```

### Production

```
npm start
```
