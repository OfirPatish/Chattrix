"use client";

import { useState } from "react";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { User as UserIcon, RefreshCw } from "lucide-react";
import AvatarSelector from "./AvatarSelector";

export default function ProfileSection({
  user,
  profileData,
  setProfileData,
  isEditing,
  setIsEditing,
  onUpdateProfile,
  isButtonLoading,
}) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  return (
    <div className="bg-base-100/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-base-300 p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="relative">
            {getAvatarUrl(user?.avatar, user?.username) ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg ring-2 sm:ring-4 ring-base-100 flex-shrink-0">
                <Image
                  src={getAvatarUrl(user?.avatar, user?.username)}
                  alt={user?.username || "Avatar"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content shadow-lg ring-2 sm:ring-4 ring-base-100 flex-shrink-0">
                <UserIcon className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
            )}
            {isEditing && (
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md hover:bg-primary-focus transition-colors"
                title="Change avatar"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-base-content truncate">
              {user?.username}
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setProfileData({
                username: user?.username || "",
                email: user?.email || "",
                avatar: user?.avatar || "",
              });
              setIsEditing(true);
            }}
            className="btn btn-outline btn-sm w-full sm:w-auto"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing && (
        <div className="space-y-4 pt-4 border-t border-base-300">
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text font-semibold text-xs sm:text-sm text-base-content">
                Username
              </span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-base-content/60 z-10 pointer-events-none" />
              <input
                type="text"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    username: e.target.value,
                  })
                }
                className="input input-bordered w-full pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base focus:outline-none text-base-content placeholder:text-base-content/50"
                placeholder="Your username"
                autoFocus
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onUpdateProfile}
              disabled={isButtonLoading}
              className="btn btn-primary flex-1 w-full sm:w-auto"
            >
              {isButtonLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setProfileData({
                  username: user?.username || "",
                  email: user?.email || "",
                  avatar: user?.avatar || "",
                });
                setShowAvatarSelector(false);
              }}
              className="btn btn-outline w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAvatarSelector && (
        <AvatarSelector
          username={user?.username}
          selectedAvatar={profileData.avatar}
          onSelect={(avatarUrl) => {
            setProfileData({
              ...profileData,
              avatar: avatarUrl,
            });
            setShowAvatarSelector(false);
          }}
        />
      )}
    </div>
  );
}
