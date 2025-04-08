# 🌟 Chattrix Frontend

This is the frontend for the Chattrix real-time chat application, built with React and Vite.

## 📚 Technologies Used

- ⚛️ React 19 for UI components
- 🎨 TailwindCSS 4 & DaisyUI for styling
- 🔄 Zustand for state management
- ⚡ Vite for fast development
- 📡 Socket.io client for real-time communication
- 🚦 React Router v7 for routing
- 🔔 React Hot Toast for notifications
- 🖼️ DiceBear for avatar generation

## 🏗️ Project Structure

- `components/` - Reusable UI components
  - `Navbar.jsx` - Navigation component
  - And more UI components for the chat interface
- `pages/` - Application pages
  - Various pages for login, registration, chat, profile, and settings
- `store/` - State management with Zustand
  - `useAuthStore.js` - Authentication state
  - `useThemeStore.js` - Theme management
  - Other state stores for application functionality
- `lib/` - Utility functions
  - API client configuration and helper utilities
- `constants/` - Application constants

## 🚀 Development

```
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔄 Features

- User authentication (login/register)
- Real-time messaging
- Theme customization
- Profile management
- Avatar generation

## 🔗 Connection with Backend

The frontend connects to the Chattrix backend API for data retrieval and real-time communication using Socket.io, providing a seamless chat experience.
