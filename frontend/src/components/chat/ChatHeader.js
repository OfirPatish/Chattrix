"use client";

import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { userAPI } from "@/lib/api";
import { User, X } from "lucide-react";

export default function ChatHeader({ chat }) {
  const { user } = useAuthStore();
  const otherUser = chat.participants?.find((p) => p._id !== user?._id);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const handleViewProfile = async () => {
    if (!otherUser?._id) return;

    setIsLoadingUser(true);
    try {
      const response = await userAPI.getUserById(otherUser._id);
      if (response.success) {
        setUserDetails(response.data);
        setShowUserProfile(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  return (
    <>
      <div className="px-5 py-4 border-b border-base-300 bg-base-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 h-11">
          <div className="avatar placeholder">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center shadow-md ring-2 ring-base-100">
              <User className="h-6 w-6" />
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-base-100 ${
                otherUser?.isOnline ? "bg-success" : "bg-base-300"
              }`}
            ></div>
          </div>
          <div className="flex-1 min-w-0">
            <button
              onClick={handleViewProfile}
              className="font-semibold truncate text-base hover:text-primary transition-colors text-left w-full"
              disabled={isLoadingUser}
            >
              {otherUser?.username || "Unknown User"}
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  otherUser?.isOnline ? "bg-success" : "bg-base-300"
                }`}
              ></div>
              <p className="text-xs text-base-content/70">
                {otherUser?.isOnline ? "Active now" : "Offline"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showUserProfile && userDetails && (
        <dialog className="modal modal-open z-[300]">
          <div className="modal-box max-w-md p-0 overflow-hidden relative z-[301]">
            <div className="p-6 border-b border-base-300 flex items-center justify-between bg-base-100">
              <h3 className="text-xl font-bold">User Profile</h3>
              <button
                onClick={() => {
                  setShowUserProfile(false);
                  setUserDetails(null);
                }}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center">
                <div className="avatar placeholder mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center shadow-lg ring-4 ring-base-100">
                    <User className="h-12 w-12" />
                  </div>
                  {userDetails.isOnline && (
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-success border-4 border-base-100 rounded-full"></div>
                  )}
                </div>
                <h4 className="text-2xl font-bold mb-1">
                  {userDetails.username}
                </h4>
                <p className="text-sm text-base-content/70">
                  {userDetails.email}
                </p>
              </div>

              <div className="divider"></div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-base-content/60" />
                  <div>
                    <p className="text-xs text-base-content/60">Status</p>
                    <p className="font-medium">
                      {userDetails.isOnline ? (
                        <span className="text-success">Online</span>
                      ) : (
                        <span className="text-base-content/70">
                          Offline
                          {userDetails.lastSeen && (
                            <span className="text-xs ml-2">
                              (Last seen:{" "}
                              {new Date(userDetails.lastSeen).toLocaleString()})
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {userDetails.createdAt && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-base-content/60" />
                    <div>
                      <p className="text-xs text-base-content/60">
                        Member since
                      </p>
                      <p className="font-medium">
                        {new Date(userDetails.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-base-300 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowUserProfile(false);
                  setUserDetails(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
          <form 
            method="dialog" 
            className="modal-backdrop z-[300]"
            onClick={() => {
              setShowUserProfile(false);
              setUserDetails(null);
            }}
          >
            <button type="button">close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
