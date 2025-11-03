"use client";

import { useState } from "react";
import useChatStore from "@/store/chatStore";
import { useUserSearch } from "@/hooks/chat/useUserSearch";
import UserSearchInput from "./UserSearchInput";
import UserList from "./UserList";
import { Search, X, Frown, Loader2 } from "lucide-react";

export default function UserSearch({ onClose }) {
  const { createChat } = useChatStore();
  const { searchTerm, setSearchTerm, users, isLoading, error, reset } =
    useUserSearch();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleSelectUser = async (userId) => {
    if (!userId || isCreatingChat) return;

    setIsCreatingChat(true);
    try {
      const result = await createChat(userId);
      if (result.success) {
        onClose();
        reset();
      } else {
        // Error will be handled by the error state in useUserSearch
        console.error("Create chat error:", result.error);
      }
    } catch (error) {
      console.error("Create chat error:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleBackdropClick = () => {
    onClose();
    reset();
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
          <UserSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />
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
                <button onClick={reset} className="btn btn-sm btn-outline mt-2">
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
              <UserList
                users={users}
                onSelectUser={handleSelectUser}
                isLoading={isCreatingChat}
              />
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
