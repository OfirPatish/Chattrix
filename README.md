# Chattrix - Real-Time Chat Application

A modern, full-stack real-time chat application showcasing best practices in web development with real-time communication, secure authentication, and modern UI/UX.

**🌐 Live Demo:** [https://chattrix-frontend-ygl8.onrender.com](https://chattrix-frontend-ygl8.onrender.com)

## 🚀 Tech Stack

**Backend:** Node.js, Express.js 4.22.1, MongoDB with Mongoose 8.20.4, Socket.io 4.8.3  
**Frontend:** Next.js 16.1.1, React 19.2.3, Tailwind CSS 4.1.18, DaisyUI 5.5.14  
**State Management:** Zustand 5.0.9, TanStack Query 5.90.12  
**Authentication:** JWT (access + refresh tokens), bcrypt

## ✨ Key Features

- **JWT Authentication:** Access tokens (15min) + Refresh tokens (7 days) with automatic refresh
- **Real-time Messaging:** Socket.io-powered instant messaging with typing indicators and read receipts
- **Online/Offline Status:** Real-time user presence tracking
- **Error Handling:** Comprehensive error handling with field-specific validation errors
- **Responsive Design:** Mobile-first approach with seamless cross-device experience
- **Modern UI:** DaisyUI components with smooth animations (Motion.dev)
- **Performance:** Optimistic updates, request deduplication, efficient caching
- **Security:** Rate limiting, CORS protection, input validation, password hashing

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
# Create .env.local with NEXT_PUBLIC_BACKEND_URL=http://localhost:3000 (optional)
npm run dev
```

**Ports:** Backend (3000) | Frontend (3001)

### Run Both Servers

```bash
# From root directory
npm run dev
```

## 📁 Project Structure

```
chattrix/
├── backend/     # Express API with MongoDB and Socket.io
└── frontend/    # Next.js application
```

## 🔒 Security Features

- JWT authentication with secure token management and refresh token rotation
- Password hashing using bcrypt
- Input validation and sanitization (client and server-side)
- Rate limiting and CORS protection
- MongoDB injection prevention (Mongoose)
- Error handling middleware
- Token blacklisting on logout

## 🧪 Testing

**Backend:** `npm test` (71%+ coverage) | **Frontend:** Manual testing with error boundaries

## 📚 Documentation

- **Backend API Reference:** [`backend/API_REFERENCE.md`](backend/API_REFERENCE.md)
- **Backend Updates:** [`backend/PACKAGE_UPDATES.md`](backend/PACKAGE_UPDATES.md)
- **Frontend Updates:** [`frontend/FRONTEND_UPDATES.md`](frontend/FRONTEND_UPDATES.md)
- **Backend README:** [`backend/README.md`](backend/README.md)
- **Frontend README:** [`frontend/README.md`](frontend/README.md)

## 🎯 Best Practices Implemented

- **DRY Principle:** Reusable utilities and components
- **Separation of Concerns:** Clear layer separation (routes → controllers → services)
- **Error Handling:** Centralized error handling with custom error classes
- **Code Organization:** Modular structure with single responsibility principle
- **API Design:** RESTful conventions with consistent response formats
- **Security:** Multiple layers of protection and validation
- **Performance:** Optimized queries, connection pooling, compression

---

**Author:** Ofir Patish  
**License:** MIT
