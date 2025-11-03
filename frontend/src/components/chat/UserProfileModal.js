"use client";

import { useMemo } from "react";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { User, X } from "lucide-react";

export default function UserProfileModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  return (
    <dialog className="modal modal-open z-[300]">
      <div className="modal-box max-w-md p-0 overflow-hidden relative z-[301]">
        <div className="p-6 border-b border-base-300 flex items-center justify-between bg-base-100">
          <h3 className="text-xl font-bold">User Profile</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center">
            <div className="avatar placeholder mb-4">
              {getAvatarUrl(user.avatar, user.username) ? (
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-4 ring-base-100">
                  <Image
                    src={getAvatarUrl(user.avatar, user.username)}
                    alt={user.username || "Avatar"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center shadow-lg ring-4 ring-base-100">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <h4 className="text-2xl font-bold mb-1 truncate max-w-full px-4">
              {user.username}
            </h4>
            <p className="text-sm text-base-content/70">{user.email}</p>
          </div>

          <div className="divider"></div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-base-content/60" />
              <div>
                <p className="text-xs text-base-content/60">Status</p>
                <p className="font-medium">
                  {user.isOnline ? (
                    <span className="text-success">Online</span>
                  ) : (
                    <span className="text-base-content/70">
                      Offline
                      {user.lastSeen && (
                        <span className="text-xs ml-2">
                          (Last seen: {new Date(user.lastSeen).toLocaleString()}
                          )
                        </span>
                      )}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-base-content/60" />
                <div>
                  <p className="text-xs text-base-content/60">Member since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-base-300 flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form
        method="dialog"
        className="modal-backdrop z-[300]"
        onClick={onClose}
      >
        <button type="button">close</button>
      </form>
    </dialog>
  );
}
