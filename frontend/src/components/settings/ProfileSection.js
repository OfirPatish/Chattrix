"use client";

import { useState, useEffect } from "react";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { User as UserIcon, RefreshCw, AlertCircle, CheckCircle2, Edit2 } from "lucide-react";
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
  successMessage,
  clearSuccess,
}) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Clear errors when editing stops
  useEffect(() => {
    if (!isEditing) {
      clearError?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Check if there are unsaved changes
  const hasChanges = 
    profileData.username !== user?.username || 
    profileData.avatar !== user?.avatar;

  return (
    <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
      <div className="card-body p-4 sm:p-6">
        {/* Success Alert */}
        {successMessage && (
          <div className="alert alert-success mb-4 shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">{successMessage}</span>
            <button
              onClick={clearSuccess}
              className="btn btn-sm btn-ghost btn-circle"
              aria-label="Close success message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {getAvatarUrl(user?.avatar, user?.username) ? (
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg ring-2 transition-all ${
                  isEditing && profileData.avatar !== user?.avatar 
                    ? "ring-success ring-offset-2 ring-offset-base-100" 
                    : "ring-base-200"
                }`}>
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
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content shadow-lg ring-2 transition-all ${
                  isEditing && profileData.avatar !== user?.avatar 
                    ? "ring-success ring-offset-2 ring-offset-base-100" 
                    : "ring-base-200"
                }`}>
                  <UserIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              )}
              {isEditing && (
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg hover:bg-primary-focus transition-all hover:scale-110 active:scale-95"
                  title="Change avatar"
                  aria-label="Change avatar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-xl sm:text-2xl font-bold truncate transition-colors ${
                  isEditing && profileData.username !== user?.username
                    ? "text-success"
                    : "text-base-content"
                }`}>
                  {isEditing ? profileData.username || "User" : user?.username || "User"}
                </h2>
                {isEditing && profileData.username !== user?.username && (
                  <div className="badge badge-success badge-sm gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Changed
                  </div>
                )}
              </div>
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
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing && (
          <div className="space-y-5 pt-6 border-t border-base-300">
            {/* Display general error */}
            {error && (
              <div className="alert alert-error shadow-lg">
                <AlertCircle className="h-5 w-5" />
                <ErrorDisplay error={error} />
              </div>
            )}

            {/* Change indicator */}
            {hasChanges && (
              <div className="alert alert-info shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-5 w-5 stroke-current shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold text-sm text-base-content flex items-center gap-2">
                  Username
                  {profileData.username !== user?.username && (
                    <span className="badge badge-success badge-sm gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Changed
                    </span>
                  )}
                </span>
              </label>
              <div className="relative">
                <UserIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 z-10 pointer-events-none transition-colors ${
                  profileData.username !== user?.username 
                    ? "text-success" 
                    : "text-base-content/40"
                }`} />
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
                  className={`input input-bordered w-full pl-12 pr-4 focus:outline-none transition-all ${
                    fieldErrors?.username 
                      ? "input-error" 
                      : profileData.username !== user?.username
                      ? "input-success border-success/50"
                      : ""
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

            {/* Avatar change indicator */}
            {isEditing && profileData.avatar !== user?.avatar && (
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-sm text-base-content flex items-center gap-2">
                    Avatar
                    <span className="badge badge-success badge-sm gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Changed
                    </span>
                  </span>
                </label>
                <div className="alert alert-success shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Avatar will be updated when you save</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onUpdateProfile}
                disabled={isButtonLoading || !hasChanges}
                className={`btn flex-1 gap-2 ${
                  hasChanges ? "btn-primary" : "btn-disabled"
                }`}
              >
                {isButtonLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
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
                  clearSuccess?.();
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
