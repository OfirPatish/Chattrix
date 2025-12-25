"use client";

import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { User } from "lucide-react";

export default function UserList({ users, onSelectUser, isLoading }) {
  if (!users || users.length === 0) return null;

  return (
    <div className="space-y-2 py-2">
      {users.map((user) => {
        if (!user || !user._id) return null;

        return (
          <button
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-base-200 border-2 border-transparent hover:border-base-300 transition-all text-left active:scale-[0.98] hover:shadow-md"
            disabled={isLoading}
          >
            <div className="avatar placeholder relative">
              {getAvatarUrl(user.avatar, user.username) ? (
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg ring-1 ring-base-300">
                  <Image
                    src={getAvatarUrl(user.avatar, user.username)}
                    alt={user.username || "Avatar"}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg ring-1 ring-base-300 flex items-center justify-center">
                  <User className="h-7 w-7" />
                </div>
              )}
              {/* Online status indicator */}
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-base-100 shadow-sm" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-base mb-1">
                {user.username || "Unknown User"}
              </div>
              <div className="text-sm text-base-content/70 truncate">
                {user.email || ""}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`w-2 h-2 rounded-full ${
                  user.isOnline ? "bg-success animate-pulse" : "bg-base-content/30"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  user.isOnline ? "text-success" : "text-base-content/50"
                }`}
              >
                {user.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
