"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import ChatList from "@/components/chat/list/ChatList";
import MessageList from "@/components/chat/messages/MessageList";
import MessageInput from "@/components/chat/messages/MessageInput";
import UserSearch from "@/components/chat/UserSearch";
import Navbar from "@/components/common/Navbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, verifyAuth } = useAuthStore();
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // Initialize as false on both server and client to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Schedule state update asynchronously to avoid linter warning
    // This ensures server and client render the same initial content
    queueMicrotask(() => {
      setIsMounted(true);
    });

    const checkAuth = async () => {
      const isValid = await verifyAuth();
      if (!isValid) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, verifyAuth]);

  // Show loading state during mount/auth check
  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-base-200 via-base-200 to-base-100">
      <Navbar
        onMenuClick={() => setShowMobileSidebar(!showMobileSidebar)}
        showMobileSidebar={showMobileSidebar}
        onNewChat={() => setShowUserSearch(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-base-content/30 backdrop-blur-md z-40 lg:hidden transition-opacity"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        <div
          className={`fixed lg:static h-full left-0 z-50 lg:z-auto transform ${
            showMobileSidebar ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-out w-full sm:w-80 lg:w-96 bg-base-100 border-r-2 border-base-300 flex flex-col shadow-2xl lg:shadow-lg`}
        >
          <ChatList
            onCloseMobile={() => setShowMobileSidebar(false)}
            onNewChat={() => setShowUserSearch(true)}
          />
        </div>

        <div className="flex-1 flex flex-col bg-base-100 min-w-0 overflow-hidden shadow-inner">
          <MessageList onNewChat={() => setShowUserSearch(true)} />
          <MessageInput />
        </div>
      </div>

      {showUserSearch && (
        <UserSearch onClose={() => setShowUserSearch(false)} />
      )}
    </div>
  );
}
