"use client";

import { useMemo } from "react";
import useAuthStore from "@/store/authStore";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { User } from "lucide-react";
import { useUserProfile } from "@/hooks/chat/useUserProfile";
import UserProfileModal from "./UserProfileModal";

export default function ChatHeader({ chat }) {
  const { user } = useAuthStore();
  // Memoize otherUser to prevent re-renders when chat object reference changes but data is same
  const otherUser = useMemo(
    () => chat.participants?.find((p) => p._id !== user?._id),
    [chat.participants, user?._id]
  );

  const {
    showUserProfile,
    userDetails,
    isLoadingUser,
    handleViewProfile,
    closeProfile,
  } = useUserProfile();

  return (
    <>
      <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border-b border-base-300 bg-base-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="avatar placeholder relative flex-shrink-0">
            {getAvatarUrl(otherUser?.avatar, otherUser?.username) ? (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-1 ring-base-300">
                <Image
                  src={getAvatarUrl(otherUser?.avatar, otherUser?.username)}
                  alt={otherUser?.username || "Avatar"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center ring-1 ring-base-300">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            )}
            {otherUser?.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-success rounded-full border-2 border-base-100" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => otherUser?._id && handleViewProfile(otherUser._id)}
              className="font-semibold truncate text-sm sm:text-base hover:text-primary transition-colors text-left w-full"
              disabled={isLoadingUser}
            >
              {otherUser?.username || "Unknown User"}
            </button>
            <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  otherUser?.isOnline ? "bg-success" : "bg-base-content/30"
                }`}
              />
              <p className="text-xs text-base-content/60">
                {otherUser?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <UserProfileModal
        user={userDetails}
        isOpen={showUserProfile}
        onClose={closeProfile}
      />
    </>
  );
}
