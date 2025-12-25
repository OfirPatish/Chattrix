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
      <div className="modal-box max-w-2xl p-0 overflow-hidden relative z-[301] shadow-2xl border-2 border-base-300">
        <div className="p-6 border-b-2 border-base-300 bg-gradient-to-r from-base-100 to-base-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                New Conversation
              </h3>
              <p className="text-sm text-base-content/70 font-medium">
                Search for users to start chatting
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-base-100">
          <UserSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users by username or email..."
          />
        </div>

        <div className="px-6 pb-6 max-h-96 overflow-y-auto min-h-[300px] scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
          <div className="relative min-h-[300px]">
            {searchTerm.trim().length < 2 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center mb-4 shadow-lg">
                  <Search className="h-12 w-12 text-base-content/40" />
                </div>
                <p className="text-base font-semibold text-base-content/80 mb-1">
                  Type to search for users
                </p>
                <p className="text-xs text-base-content/60 mt-2">
                  Search by username or email (minimum 2 characters)
                </p>
              </div>
            )}

            {isLoading && searchTerm.trim().length >= 2 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-base font-semibold text-base-content/70">
                  Searching...
                </p>
              </div>
            )}

            {error && !isLoading && (
              <div className="absolute inset-0 flex flex-col justify-center items-center py-12">
                <div className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center mb-4 shadow-lg">
                  <X className="h-12 w-12 text-error" />
                </div>
                <p className="text-base font-bold text-error mb-2">{error}</p>
                <button
                  onClick={reset}
                  className="btn btn-outline btn-sm mt-2 hover:scale-105 transition-transform"
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
                  <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center mb-4 shadow-lg">
                    <Frown className="h-12 w-12 text-base-content/40" />
                  </div>
                  <p className="text-base font-bold text-base-content/80 mb-1">
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

        <div className="p-6 border-t-2 border-base-300 bg-base-200/50 flex justify-end">
          <button
            className="btn btn-outline hover:scale-105 transition-transform"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop z-[300] bg-base-content/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
