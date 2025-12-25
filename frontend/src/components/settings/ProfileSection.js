"use client";

import { useState, useEffect } from "react";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { User as UserIcon, RefreshCw, AlertCircle } from "lucide-react";
import AvatarSelector from "./AvatarSelector";
import ErrorDisplay from "@/components/auth/ErrorDisplay";

export default function ProfileSection({
  user,
  profileData,
  setProfileData,
  isEditing,
  setIsEditing,
  onUpdateProfile,
  isButtonLoading,
  error,
  fieldErrors,
  clearError,
}) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Clear errors when editing stops
  useEffect(() => {
    if (!isEditing) {
      clearError?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
      <div className="card-body p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {getAvatarUrl(user?.avatar, user?.username) ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg ring-2 ring-base-200">
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content shadow-lg ring-2 ring-base-200">
                  <UserIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg hover:bg-primary-focus transition-all hover:scale-110"
                  title="Change avatar"
                  aria-label="Change avatar"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-base-content truncate mb-1">
                {user?.username || "User"}
              </h2>
              <p className="text-sm sm:text-base text-base-content/60 truncate">
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
              className="btn btn-primary btn-sm w-full sm:w-auto gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing && (
          <div className="space-y-4 pt-6 border-t border-base-300">
            {/* Display general error */}
            {error && <ErrorDisplay error={error} />}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold text-sm text-base-content">
                  Username
                </span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40 z-10 pointer-events-none" />
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      username: e.target.value,
                    });
                    if (fieldErrors?.username && clearError) {
                      clearError();
                    }
                  }}
                  className={`input input-bordered w-full pl-12 pr-4 focus:outline-none ${
                    fieldErrors?.username ? "input-error" : ""
                  }`}
                  placeholder="Your username"
                  autoFocus
                />
              </div>
              {fieldErrors?.username && (
                <label className="label pt-1">
                  <span className="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.username}
                  </span>
                </label>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onUpdateProfile}
                disabled={isButtonLoading}
                className="btn btn-primary flex-1 gap-2"
              >
                {isButtonLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Save Changes
                  </>
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
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

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
