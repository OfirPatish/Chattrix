# 💬 Chattrix

A modern real-time chat application built with the MERN stack and enhanced with Socket.io for instant messaging. Experience seamless communication with a beautiful, responsive interface.

<div align="center">
  <strong>Built with modern web technologies for the best chat experience</strong>
</div>

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication and authorization
- 💬 **Real-time Messaging** - Instant message delivery with Socket.io
- 🟢 **Presence Detection** - See who's online with real-time status updates
- 🖼️ **Custom Profiles** - Personalize your experience with custom avatars
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌙 **Theme Support** - Toggle between light and dark modes for comfortable viewing
- 🔄 **State Management** - Efficient state handling with Zustand
- 🛡️ **Security** - Comprehensive security features including rate limiting and secure headers

## 🛠️ Tech Stack

### Frontend

- ⚛️ **React 19** - Modern UI framework with the latest features
- 🎨 **TailwindCSS 4 & DaisyUI** - Utility-first CSS and component library
- 🔄 **Zustand** - Lightweight state management
- ⚡ **Vite** - Next-generation frontend tooling
- 📡 **Socket.io Client** - Real-time bidirectional communication
- 🚦 **React Router v7** - Declarative routing for React
- 🔔 **React Hot Toast** - Elegant notifications
- 🖼️ **DiceBear** - Avatar generation API

### Backend

- 📡 **Node.js & Express** - Fast, minimalist web framework
- 🗃️ **MongoDB** - Flexible NoSQL database
- 🔐 **JWT** - Secure authentication tokens
- ⚡ **Socket.io** - Real-time event-based communication
- 🛡️ **Helmet** - Security with HTTP headers
- 🚧 **Rate Limiting** - API protection against abuse
- 🔍 **Morgan** - HTTP request logger
- 🗜️ **Compression** - Response optimization for faster loading

## 📋 Project Structure

```
chattrix/
├── frontend/           # React Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   ├── store/      # Zustand state management
│   │   ├── lib/        # Utility functions
│   │   └── constants/  # App constants
│   └── public/         # Static assets
└── backend/
    ├── src/
    │   ├── controllers/ # Request handlers
    │   ├── models/      # Database models
    │   ├── routes/      # API routes
    │   ├── middleware/  # Custom middleware
    │   ├── lib/         # Utility functions
    │   └── config/      # Application configuration
    └── .env             # Environment variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Environment Setup

Create a `.env` file in the backend directory:

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

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/OfirPatish/Chattrix.git
   cd Chattrix
   ```

2. Install backend dependencies

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the backend server

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

#### Production Mode

1. Build the frontend

   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server (which will serve the frontend)

   ```bash
   cd backend
   npm start
   ```

3. Alternatively, use the root scripts for combined operations:

   ```bash
   # Install all dependencies and build frontend
   npm run build

   # Start the application
   npm start
   ```

## 🔒 Security

Chattrix implements several security best practices:

- JWT authentication with secure cookie storage
- Input validation and sanitization
- Rate limiting to prevent brute force attacks
- Secure HTTP headers with Helmet
- CORS configuration for API protection
- Environment variable management for sensitive data

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Icons by [heroicons](https://heroicons.com/)
- UI components from [DaisyUI](https://daisyui.com/)
- Avatar generation by [DiceBear](https://www.dicebear.com/)
