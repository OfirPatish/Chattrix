# Chattrix Frontend

Modern React application built with Next.js 16, React 19, and Tailwind CSS 4.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, DaisyUI
- **Animations:** Motion.dev
- **State:** Zustand (persist middleware), TanStack Query
- **Forms:** React Hook Form
- **Real-time:** Socket.io Client
- **HTTP:** Axios

## ✨ Features

- Landing page with animations
- Authentication (login/register)
- Real-time chat interface
- User search & chat creation
- Responsive design
- Error boundaries
- Loading states
- Form validation

## 🚀 Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - Socket.io server URL

## 📦 Key Libraries

- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form handling
- `motion` - Animations
- `zustand` - Client state
- `use-debounce` - Debouncing utilities

## 🏗️ Structure

```
src/
├── app/              # Pages
├── components/       # UI components
├── hooks/            # Custom hooks
├── store/            # Zustand stores
├── lib/              # Utilities
└── constants/        # Constants
```

## 📄 License

MIT
