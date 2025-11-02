# Chattrix 💬

A modern, real-time chat application showcasing full-stack development with real-time communication, authentication, and modern UI/UX.

## 🚀 Tech Stack

**Frontend:** Next.js 16 | React 19 | TypeScript-ready | Tailwind CSS 4 | DaisyUI | Motion.dev  
**Backend:** Node.js | Express.js | MongoDB | Mongoose | Socket.io  
**State Management:** Zustand | TanStack Query  
**Authentication:** JWT | bcrypt  
**Real-time:** Socket.io

## ✨ Key Features

- 🔐 JWT authentication with persistent sessions
- 💬 Real-time messaging with Socket.io
- ⌨️ Typing indicators & read receipts
- 🟢 Online/offline status tracking
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 🔄 Optimistic updates & caching
- ⚡ High-performance data fetching

## 🏃 Quick Start

### Option 1: Run Both Together (Recommended)

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev
```

### Option 2: Run Separately

```bash
# Backend
cd backend && npm install
cp .env.example .env  # Configure MongoDB & JWT_SECRET
npm run dev

# Frontend (new terminal)
cd frontend && npm install
cp .env.local.example .env.local  # Configure API URLs
npm run dev
```

Visit `http://localhost:3001` (Frontend) | `http://localhost:3000` (Backend)

## 📁 Architecture

Clean, scalable architecture with separation of concerns:

- **MVC Pattern** - Controllers, Models, Routes
- **Component-based UI** - Reusable React components
- **Custom Hooks** - Reusable business logic
- **Error Boundaries** - Graceful error handling
- **Middleware** - Auth, validation, rate limiting

## 🎯 Highlights

- **Performance:** Request deduplication, intelligent caching, optimized re-renders
- **UX:** Form validation, loading states, error boundaries, debounced inputs
- **Code Quality:** ESLint, consistent patterns, TypeScript-ready
- **Security:** Password hashing, JWT tokens, rate limiting, input validation

## 📦 What's Included

- Authentication system (register/login)
- Real-time chat with Socket.io
- User search & chat creation
- Message history & pagination
- Profile management
- Responsive design for all devices

## 🔧 Environment Variables

**Backend:** `MONGO_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`  
**Frontend:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`

## 🚀 Deployment

### Quick Deploy to MongoDB Atlas + Render

For detailed step-by-step instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**Quick Steps:**

1. **MongoDB Atlas:** Create cluster, database user, and get connection string
2. **Render Backend:** Deploy backend service with MongoDB connection
3. **Render Frontend:** Deploy frontend with backend URL configured
4. **Update Environment Variables:** Set CORS and API URLs

**Using Render Blueprint:**

- Push `render.yaml` to your repository
- In Render Dashboard, select "New Blueprint"
- Render will create both services automatically
- Manually configure environment variables in Render dashboard

## 📄 License

MIT License

---

**Built with modern best practices** | Ready for production deployment
