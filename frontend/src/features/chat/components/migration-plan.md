# Chattrix Project Restructuring Plan

## New Directory Structure

```
frontend/src/
├── app/                    # App-wide setup
│   ├── providers/          # Context providers
│   ├── router.jsx          # Router configuration
│   └── layout.jsx          # Root layout component
├── features/               # Feature-based modules
│   ├── chat/               # Chat feature
│   │   ├── components/     # Chat-specific components
│   │   ├── hooks/          # Chat-specific hooks
│   │   └── index.jsx       # Main chat page component
│   ├── profile/            # Profile feature
│   │   ├── components/     # Profile-specific components
│   │   └── index.jsx       # Main profile page component
│   ├── settings/           # Settings feature
│   │   ├── components/     # Settings-specific components
│   │   └── index.jsx       # Main settings page component
│   └── auth/               # Auth feature
│       ├── components/     # Auth-specific components
│       ├── login.jsx       # Login page
│       └── register.jsx    # Register page
├── shared/                 # Shared code across features
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Shared custom hooks
│   └── utils/              # Utility functions
├── store/                  # Keep existing store directory
├── lib/                    # Keep existing lib directory
├── styles/                 # Global styles (move from index.css)
├── App.jsx                 # Updated main App component
└── main.jsx                # Updated entry point
```

## Migration Steps

### 1. Create New Directory Structure

```bash
# Create main directories
mkdir -p src/app/providers
mkdir -p src/features/chat/components
mkdir -p src/features/chat/hooks
mkdir -p src/features/profile/components
mkdir -p src/features/settings/components
mkdir -p src/features/auth/components
mkdir -p src/shared/components
mkdir -p src/shared/hooks
mkdir -p src/shared/utils
mkdir -p src/styles
```

### 2. File Relocations

#### Move and Rename Pages:

- Move `src/pages/Home.jsx` → `src/features/chat/index.jsx`
- Move `src/pages/Profile.jsx` → `src/features/profile/index.jsx`
- Move `src/pages/Settings.jsx` → `src/features/settings/index.jsx`
- Move `src/pages/Login.jsx` → `src/features/auth/login.jsx`
- Move `src/pages/Register.jsx` → `src/features/auth/register.jsx`

#### Move Components:

- Move `src/components/ChatHeader.jsx` → `src/features/chat/components/ChatHeader.jsx`
- Move `src/components/ChatContainer.jsx` → `src/features/chat/components/ChatContainer.jsx`
- Move `src/components/MessageInput.jsx` → `src/features/chat/components/MessageInput.jsx`
- Move `src/components/ChatMessage.jsx` → `src/features/chat/components/ChatMessage.jsx`
- Move `src/components/EmptyChat.jsx` → `src/features/chat/components/EmptyChat.jsx`
- Move `src/components/Sidebar.jsx` → `src/features/chat/components/Sidebar.jsx`

- Move `src/components/profile/*` → `src/features/profile/components/`

- Move `src/components/Navbar.jsx` → `src/shared/components/Navbar.jsx`
- Move `src/components/AuthImagePattern.jsx` → `src/features/auth/components/AuthImagePattern.jsx`
- Move `src/components/skeletons/*` → `src/shared/components/skeletons/`
- Move `src/components/ui/*` → `src/shared/components/ui/`

- Move `src/index.css` → `src/styles/index.css` - we'll leave it where it is right now.

### 3. New Files to Create

#### Router Configuration:

Create `src/app/router.jsx`:

```jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout";

// Feature pages
import Chat from "../features/chat";
import Profile from "../features/profile";
import Settings from "../features/settings";
import Login from "../features/auth/login";
import Register from "../features/auth/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);
```

#### App Layout:

Create `src/app/layout.jsx`:

```jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import Navbar from "../shared/components/Navbar";

const AppLayout = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if user is on an authentication page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Check authentication status when not on auth pages
  useEffect(() => {
    if (!isAuthPage) {
      checkAuth();
    } else {
      // Reset checking state when on auth pages
      useAuthStore.setState({ isCheckingAuth: false });
    }
  }, [checkAuth, isAuthPage]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (authUser) {
      // Redirect authenticated users away from auth pages
      if (isAuthPage) {
        navigate("/");
      }
    } else if (!isCheckingAuth) {
      // Redirect unauthenticated users to login
      // Allow access to settings page for everyone
      if (location.pathname === "/" || location.pathname === "/profile") {
        navigate("/login");
      }
    }
  }, [authUser, isCheckingAuth, location.pathname, navigate, isAuthPage]);

  // Show loading indicator while checking authentication
  if (isCheckingAuth && !authUser && !isAuthPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default AppLayout;
```

### 4. Update Existing Files

#### Update `src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./styles/index.css";

// Root rendering with React StrictMode
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

#### Update `src/App.jsx`:

```jsx
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
```

### 5. Update Imports

After moving all files, you'll need to update imports in each file to reflect the new file locations. For example:

- Update imports in Chat components to use the new paths
- Update imports in Auth components
- Update imports in Profile components
- Update imports in Settings components

### 6. Cleanup

Once all files are moved and imports are updated:

- Delete the now-empty `src/pages/` directory
- Delete the now-empty `src/components/` directory

### 7. Testing

After completing the migration:

1. Start the development server
2. Test all routes and functionality
3. Fix any import issues that may have been missed
