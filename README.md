# 💬 Chattrix

A modern real-time chat application built with the MERN stack and Socket.io.

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/MongoDB-4.4-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io" alt="Socket.io"/>
</div>

## ✨ Features

- 🔐 **Secure Authentication** - User accounts protected with JWT
- 💬 **Real-time Messaging** - Instant communication with Socket.io
- 🟢 **Online Status** - See who's available in real-time
- 🌙 **Dark/Light Mode** - Choose your preferred theme
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/OfirPatish/Chattrix.git
cd Chattrix

# Install dependencies
npm run build

# Start application
npm start
```

## 🛠️ Tech Stack

### Frontend

- React 19
- TailwindCSS 4 & DaisyUI
- Zustand (State Management)
- Vite
- Socket.io Client

### Backend

- Node.js & Express
- MongoDB
- JWT Authentication
- Socket.io

## 📋 Project Structure

```
chattrix/
├── frontend/       # React application
├── backend/        # Express API server
```

## ⚙️ Development

```bash
# Run backend and frontend in development mode
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend
```

## 🔧 Environment Setup

Create a `.env` file in the backend directory with:

```
# Database
MONGO_URL=your_mongodb_connection_string

# Server
PORT=3000

# Authentication
JWT_SECRET=your_secure_jwt_secret

# External Services
IMGBB_API_KEY=your_imgbb_api_key

# Environment
NODE_ENV=development
```

## 📝 License

[MIT License](LICENSE)
