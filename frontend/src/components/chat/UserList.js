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
            <span
              className={`text-xs flex-shrink-0 ${
                user.isOnline ? "text-success" : "text-base-content/50"
              }`}
            >
              {user.isOnline ? "Online" : "Offline"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
