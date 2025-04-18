# 🚀 Chattrix Backend

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-14+-339933?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-4.4-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io" alt="Socket.io"/>
</div>

The powerful backend for Chattrix real-time chat application.

## ⚡ Features

- RESTful API with Express
- Real-time messaging via Socket.io
- MongoDB for data persistence
- JWT authentication
- API security with rate limiting and Helmet

## 🚦 API Endpoints

```
# Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/logout
GET  /api/auth/profile

# Messages
GET  /api/messages/:userId
POST /api/messages

# System
GET  /health
```

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Environment Variables

Create a `.env` file with:

```
# Database
MONGO_URL=mongodb://localhost:27017/chattrix

# Server
PORT=3000
NODE_ENV=development

# Authentication
JWT_SECRET=your_secure_jwt_secret

# External Services
IMGBB_API_KEY=your_imgbb_api_key

# Client
CLIENT_URL=http://localhost:5173
```

## 📁 Project Structure

```
backend/
├── controllers/  # Request handlers
├── models/       # Database schemas
├── routes/       # API endpoints
├── middleware/   # Custom middleware
├── lib/          # Utilities
└── config/       # Configuration
```
