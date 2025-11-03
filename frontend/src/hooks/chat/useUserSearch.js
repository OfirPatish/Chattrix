import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";

/**
 * Hook to handle user search functionality with debouncing
 */
export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setUsers([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await userAPI.getUsers(searchTerm.trim());
        if (response.success) {
          setUsers(Array.isArray(response.data) ? response.data : []);
        } else {
          setError("Failed to search users");
          setUsers([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setError(
          error.response?.data?.message ||
            "Failed to search users. Please try again."
        );
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const reset = () => {
    setSearchTerm("");
    setUsers([]);
    setError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    users,
    isLoading,
    error,
    reset,
  };
}
