# ✨ Chattrix Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Zustand-4-000000?style=for-the-badge" alt="Zustand"/>
</div>

Modern and responsive frontend for the Chattrix real-time chat application.

## 🎨 Features

- Sleek, responsive UI with TailwindCSS and DaisyUI
- Real-time messaging with Socket.io
- Light and dark themes with theme-switch
- State management with Zustand
- Form handling and validation
- Custom avatar generation

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧩 Key Components

- **Authentication** - Login, register, and profile pages
- **Chat Interface** - Real-time messaging UI
- **Theme Switcher** - Toggle between light and dark modes
- **Responsive Design** - Works on all device sizes

## 📁 Project Structure

```
frontend/
├── public/         # Static assets
├── src/
│   ├── app/        # App configuration
│   ├── features/   # Feature modules
│   ├── lib/        # Utility functions
│   ├── shared/     # Reusable components
│   └── store/      # Zustand state stores
```

## 🔌 API Integration

Communicates with the Chattrix backend API for:

- User authentication
- Message handling
- Real-time updates via Socket.io
