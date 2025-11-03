import { useState } from "react";
import { userAPI } from "@/lib/api";

/**
 * Hook to manage user profile modal state and data fetching
 */
export function useUserProfile() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [cachedUserId, setCachedUserId] = useState(null);

  const handleViewProfile = async (userId) => {
    if (!userId) return;

    // Use cached data if available and same user
    if (userDetails && cachedUserId === userId) {
      setShowUserProfile(true);
      return;
    }

    setIsLoadingUser(true);
    try {
      const response = await userAPI.getUserById(userId);
      if (response.success) {
        setUserDetails(response.data);
        setCachedUserId(userId);
        setShowUserProfile(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const closeProfile = () => {
    setShowUserProfile(false);
    // Keep userDetails for caching, but reset if user changes
  };

  return {
    showUserProfile,
    userDetails,
    isLoadingUser,
    handleViewProfile,
    closeProfile,
  };
}
