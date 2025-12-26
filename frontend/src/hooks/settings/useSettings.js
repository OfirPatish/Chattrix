import { useState, useEffect, useCallback } from "react";
import { userAPI } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { extractErrorMessage, extractFieldErrors } from "@/utils/errorUtils";

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
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

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
      // Only send fields that have changed
      const updates = {};
      
      if (profileData.username !== user?.username) {
        updates.username = profileData.username;
      }
      
      // Only include avatar if it has changed and is not empty
      if (profileData.avatar !== user?.avatar && profileData.avatar?.trim()) {
        // Validate avatar length (max 10000 characters)
        if (profileData.avatar.length > 10000) {
          setError("Avatar URL is too long. Please select a different avatar.");
          setIsLoading(false);
          setLocalLoading(false);
          return;
        }
        updates.avatar = profileData.avatar;
      }

      // Don't send request if nothing changed
      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        setIsLoading(false);
        setLocalLoading(false);
        return;
      }

      const response = await userAPI.updateProfile(updates);

      // Ensure minimum loading duration of 800ms for better UX
      const elapsedTime = performance.now() - startTime;
      const minDuration = 800;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      if (response.success) {
        setIsEditing(false);
        useAuthStore.getState().setUser(response.data);
        setError(null);
        setFieldErrors({});
        
        // Set success message based on what was updated
        const updatedFields = [];
        if (updates.username) updatedFields.push("username");
        if (updates.avatar) updatedFields.push("avatar");
        
        if (updatedFields.length > 0) {
          const fieldNames = updatedFields.map(f => f === "username" ? "name" : "avatar").join(" and ");
          setSuccessMessage(`${fieldNames.charAt(0).toUpperCase() + fieldNames.slice(1)} updated successfully!`);
          // Clear success message after 5 seconds
          setTimeout(() => setSuccessMessage(null), 5000);
        }
      } else {
        // Handle non-success response
        const errorMsg = response?.message || "Failed to update profile";
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = extractErrorMessage(error, "Failed to update profile");
      const errors = extractFieldErrors(error);
      setError(errorMessage);
      setFieldErrors(errors);
    } finally {
      setIsLoading(false);
      setLocalLoading(false);
    }
  };

  // Combine store loading state with local minimum duration
  const isButtonLoading = isLoading || localLoading;

  // Memoize clearError to prevent infinite loops
  const clearError = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  // Clear success message
  const clearSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  return {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    handleUpdateProfile,
    isButtonLoading,
    error,
    fieldErrors,
    clearError,
    successMessage,
    clearSuccess,
  };
}
