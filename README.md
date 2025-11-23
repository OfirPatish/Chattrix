# Chattrix - Real-Time Chat Application

A modern, real-time chat application showcasing full-stack development with real-time communication, authentication, and modern UI/UX.

**🌐 Live Demo:** [https://chattrix-frontend-ygl8.onrender.com](https://chattrix-frontend-ygl8.onrender.com)

## 🚀 Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io  
**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, DaisyUI, Motion.dev  
**State Management:** Zustand, TanStack Query  
**Authentication:** JWT, bcrypt

## ✨ Key Features

- **JWT Authentication:** Secure authentication with persistent sessions
- **Real-time Messaging:** Socket.io-powered instant messaging
- **Typing Indicators & Read Receipts:** Enhanced communication experience
- **Online/Offline Status:** Real-time user presence tracking
- **Responsive Design:** Mobile-first approach with seamless cross-device experience
- **Modern UI:** Smooth animations and polished user interface
- **Optimistic Updates:** Instant feedback with intelligent caching
- **High Performance:** Request deduplication and optimized data fetching

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
# Create .env with MONGO_URL, JWT_SECRET, PORT=3000, FRONTEND_URL
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL
npm run dev
```

**Ports:** Backend (3000) | Frontend (3001)

## 📁 Project Structure

```
chattrix/
├── backend/     # Express API with MongoDB and Socket.io
└── frontend/    # Next.js application
```

## 🔒 Security & Validation

- JWT-based authentication with password hashing
- Input validation and sanitization
- Rate limiting and CORS protection
- MongoDB injection prevention (Mongoose)
- Error handling middleware
- Form validation with loading states
