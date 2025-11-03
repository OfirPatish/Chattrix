"use client";

import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import useChatStore from "@/store/chatStore";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { Search, X, Frown, Loader2, User } from "lucide-react";
import EmptyState from "./EmptyState";

export default function UserSearch({ onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { createChat } = useChatStore();

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

  const handleSelectUser = async (userId) => {
    if (!userId) return;

    try {
      const result = await createChat(userId);
      if (result.success) {
        onClose();
        // Reset search state when closing
        setSearchTerm("");
        setUsers([]);
        setError(null);
      } else {
        setError(result.error || "Failed to create chat");
      }
    } catch (error) {
      console.error("Create chat error:", error);
      setError("Failed to start conversation. Please try again.");
    }
  };

  const handleBackdropClick = () => {
    onClose();
    setSearchTerm("");
    setUsers([]);
    setError(null);
  };

  return (
    <dialog className="modal modal-open z-[300]">
      <div className="modal-box max-w-2xl p-0 overflow-hidden relative z-[301]">
        <div className="p-6 border-b border-base-300 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">New Conversation</h3>
            <p className="text-sm text-base-content/70">
              Search for users to start chatting
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-full pl-12 rounded-2xl focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="px-6 pb-6 max-h-96 overflow-y-auto min-h-[300px]">
          <div className="relative min-h-[300px]">
            {searchTerm.trim().length < 2 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                <Search className="h-16 w-16 text-base-content/30 mb-4" />
                <p className="text-base-content/70 font-medium">
                  Type to search for users
                </p>
                <p className="text-xs text-base-content/50 mt-2">
                  Search by username or email (minimum 2 characters)
                </p>
              </div>
            )}

            {isLoading && searchTerm.trim().length >= 2 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-base-content/70 font-medium">Searching...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center mb-4">
                  <X className="h-10 w-10 text-error" />
                </div>
                <p className="text-base font-medium text-error mb-1">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setSearchTerm("");
                  }}
                  className="btn btn-sm btn-outline mt-2"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading &&
              !error &&
              searchTerm.trim().length >= 2 &&
              users.length === 0 && (
                <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                  <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
                    <Frown className="h-10 w-10 text-base-content/40" />
                  </div>
                  <p className="text-base font-medium text-base-content/80 mb-1">
                    No users found
                  </p>
                  <p className="text-sm text-base-content/60">
                    Try a different search term
                  </p>
                </div>
              )}

            {!isLoading && !error && users.length > 0 && (
              <div className="space-y-2 py-2">
                {users.map((user) => {
                  if (!user || !user._id) return null;

                  return (
                    <button
                      key={user._id}
                      onClick={() => handleSelectUser(user._id)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-base-200 transition-colors text-left active:scale-[0.98]"
                      disabled={isLoading}
                    >
                      <div className="avatar placeholder">
                        {getAvatarUrl(user.avatar, user.username) ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                            <Image
                              src={getAvatarUrl(user.avatar, user.username)}
                              alt={user.username || "Avatar"}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md flex items-center justify-center">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-base">
                          {user.username || "Unknown User"}
                        </div>
                        <div className="text-sm text-base-content/70 truncate">
                          {user.email || ""}
                        </div>
                      </div>
                      <span className={`text-xs flex-shrink-0 ${
                        user.isOnline ? "text-success" : "text-base-content/50"
                      }`}>
                        {user.isOnline ? "Online" : "Offline"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-base-300 flex justify-end">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop z-[300]"
        onClick={handleBackdropClick}
      >
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
