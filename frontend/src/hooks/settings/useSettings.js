import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";

/**
 * Hook to manage settings page state and profile updates
 */
export function useSettings() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Sync profileData when user changes, but only if not editing
  useEffect(() => {
    if (user && !isEditing) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, isEditing]);

  const handleUpdateProfile = async () => {
    const startTime = performance.now();
    setIsLoading(true);
    setLocalLoading(true);

    try {
      const response = await userAPI.updateProfile({
        username: profileData.username,
        avatar: profileData.avatar,
      });

      // Ensure minimum loading duration of 800ms for better UX
      const elapsedTime = performance.now() - startTime;
      const minDuration = 800;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      if (response.success) {
        setIsEditing(false);
        useAuthStore.getState().setUser(response.data);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
      setLocalLoading(false);
    }
  };

  // Combine store loading state with local minimum duration
  const isButtonLoading = isLoading || localLoading;

  return {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    handleUpdateProfile,
    isButtonLoading,
  };
}
