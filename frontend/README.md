# Chattrix Frontend

Modern React application built with Next.js 16, React 19, Tailwind CSS 4, and DaisyUI.

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **UI:** React 19.2.3, Tailwind CSS 4.1.18, DaisyUI 5.5.14
- **State Management:** Zustand 5.0.9 (with persist), TanStack Query 5.90.12
- **Forms:** React Hook Form 7.69.0
- **Real-time:** Socket.io Client 4.8.3
- **HTTP Client:** Axios 1.13.2
- **Animations:** Motion.dev 12.23.26
- **Icons:** Lucide React 0.562.0

## ✨ Key Features

- **Authentication:** JWT with automatic token refresh (access + refresh tokens)
- **Real-time Chat:** Socket.io-powered instant messaging with typing indicators and read receipts
- **Error Handling:** Comprehensive error handling with field-specific validation errors
- **Responsive Design:** Mobile-first approach with DaisyUI components
- **State Management:** Server state (TanStack Query) + Client state (Zustand)
- **Performance:** Optimistic updates, request deduplication, efficient caching
- **Error Boundaries:** Graceful error handling with React Error Boundary

## 🏗️ Architecture

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components (auth, chat, common, settings)
├── hooks/            # Custom React hooks (chat, settings, socket)
├── store/            # Zustand stores
├── lib/              # API client (Axios with interceptors)
└── utils/            # Utilities (error handling, avatars, helpers)
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables (optional)
# Create .env.local with: NEXT_PUBLIC_BACKEND_URL=http://localhost:3000

# Development
npm run dev

# Production build
npm run build
npm start
```

**Environment Variables:**

- `NEXT_PUBLIC_BACKEND_URL` - Backend server URL (default: `http://localhost:3000`)

## 🔐 Authentication

- **Access Token:** Short-lived (15 minutes) for API requests
- **Refresh Token:** Long-lived (7 days) for token renewal
- **Automatic Refresh:** Axios interceptor automatically refreshes expired tokens
- **Secure Storage:** Tokens stored in Zustand with localStorage persistence

## 🛡️ Error Handling

- **Centralized Utility:** `src/utils/errorUtils.js` for consistent error handling
- **Field-Specific Errors:** Display validation errors next to input fields
- **Error Types:** Handles validation (400/422), auth (401), forbidden (403), not found (404), conflict (409), server (500)

## 🔌 Socket.io Integration

- Automatic connection on authentication using `accessToken`
- Events: `receive-message`, `typing-start/stopped`, `message-read`, `user-online/offline`
- Automatic reconnection on token refresh

## 📦 Key Dependencies

- `next` - React framework with App Router
- `@tanstack/react-query` - Server state management and caching
- `zustand` - Lightweight client state management
- `axios` - HTTP client with interceptors
- `socket.io-client` - WebSocket client for real-time communication
- `react-hook-form` - Form handling and validation
- `daisyui` - Component library for Tailwind
- `motion` - Animation library

## 🎯 Best Practices Implemented

- **Component Organization:** Modular, reusable components
- **State Management:** Separation of server state (TanStack Query) and client state (Zustand)
- **Error Handling:** Centralized error utility with consistent patterns
- **Performance:** Optimistic updates, request deduplication, efficient caching
- **Accessibility:** ARIA labels, keyboard navigation, semantic HTML

---

**Author:** Ofir Patish  
**License:** MIT
