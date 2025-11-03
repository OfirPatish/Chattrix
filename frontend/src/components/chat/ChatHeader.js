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
      <div className="px-5 py-4 border-b border-base-300 bg-base-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 h-11">
          <div className="avatar placeholder">
            {getAvatarUrl(otherUser?.avatar, otherUser?.username) ? (
              <div className="w-11 h-11 rounded-full overflow-hidden shadow-md ring-2 ring-base-100">
                <Image
                  src={getAvatarUrl(otherUser?.avatar, otherUser?.username)}
                  alt={otherUser?.username || "Avatar"}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center shadow-md ring-2 ring-base-100">
                <User className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => otherUser?._id && handleViewProfile(otherUser._id)}
              className="font-semibold truncate text-base hover:text-primary transition-colors text-left w-full"
              disabled={isLoadingUser}
            >
              {otherUser?.username || "Unknown User"}
            </button>
            <p
              className={`text-xs mt-0.5 ${
                otherUser?.isOnline ? "text-success" : "text-base-content/70"
              }`}
            >
              {otherUser?.isOnline ? "Online" : "Offline"}
            </p>
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
