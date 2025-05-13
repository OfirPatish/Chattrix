import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useChatStore } from "../store/useChatStore";
import Navbar from "../shared/components/Navbar";

const AppLayout = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { setSelectedUser, selectedUser } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if user is on an authentication page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isChatPage = location.pathname === "/";

  // Close chat when navigating away from chat page
  useEffect(() => {
    if (!isChatPage && selectedUser) {
      setSelectedUser(null);
    }
  }, [isChatPage, setSelectedUser, selectedUser]);

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
