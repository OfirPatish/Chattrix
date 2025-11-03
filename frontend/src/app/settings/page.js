"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { userAPI } from "@/lib/api";
import { getAvatarUrl, generateAvatarOptions } from "@/utils/avatarUtils";
import Image from "next/image";
import {
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Settings,
  ShieldCheck,
  Bell,
  RefreshCw,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, verifyAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyAuth();
      if (!isValid) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, verifyAuth]);

  // Sync profileData when user changes, but only if not editing
  useEffect(() => {
    if (user && !isEditing) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, isEditing]);

  // Generate avatar options when selector opens
  useEffect(() => {
    if (showAvatarSelector && user?.username) {
      const options = generateAvatarOptions(user.username, 9);
      setAvatarOptions(options);
    }
  }, [showAvatarSelector, user?.username]);

  const handleUpdateProfile = async () => {
    const startTime = performance.now();
    setIsLoading(true);
    setLocalLoading(true);

    try {
      const response = await userAPI.updateProfile({
        username: profileData.username,
        avatar: profileData.avatar,
      });

      // Ensure minimum loading duration of 800ms for better UX
      const elapsedTime = performance.now() - startTime;
      const minDuration = 800;
      const remainingTime = Math.max(0, minDuration - elapsedTime);

      // Wait for minimum duration before proceeding
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      if (response.success) {
        setIsEditing(false);
        useAuthStore.getState().setUser(response.data);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
      setLocalLoading(false);
    }
  };

  // Combine store loading state with local minimum duration
  const isButtonLoading = isLoading || localLoading;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100/80 backdrop-blur-xl border-b border-base-300 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/chat"
              className="p-2 rounded-xl hover:bg-base-200 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-base-content" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-base-content truncate">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-base-content/60">
                Manage your account
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {/* Profile Section */}
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
                  // Initialize profileData with current user data when entering edit mode
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
                  onClick={handleUpdateProfile}
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

          {/* Avatar Selector Modal */}
          {showAvatarSelector && (
            <div className="pt-4 border-t border-base-300 mt-4">
              <h3 className="text-sm font-semibold text-base-content mb-3">
                Choose Avatar
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {avatarOptions.map((avatarUrl, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProfileData({
                        ...profileData,
                        avatar: avatarUrl,
                      });
                      setShowAvatarSelector(false);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      profileData.avatar === avatarUrl
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-base-300 hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={avatarUrl}
                      alt={`Avatar option ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  // Generate new random options
                  if (user?.username) {
                    const newOptions = generateAvatarOptions(user.username, 9);
                    setAvatarOptions(newOptions);
                  }
                }}
                className="btn btn-ghost btn-sm mt-3 w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Options
              </button>
            </div>
          )}
        </div>

        {/* Settings Sections */}
        <div className="space-y-4 sm:space-y-6">
          {/* Account Settings */}
          <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-base-300 overflow-hidden">
            <div className="card-body p-0">
              <div className="p-3 sm:p-4 border-b border-base-300 bg-base-200/50">
                <h3 className="text-base sm:text-lg font-semibold text-base-content flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-base-content/60 flex-shrink-0" />
                  <span className="truncate">Account Settings</span>
                </h3>
              </div>
              <div className="divide-y divide-base-300">
                <div className="p-3 sm:p-4 hover:bg-base-200/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-base-content truncate">
                        Profile Information
                      </p>
                      <p className="text-xs sm:text-sm text-base-content/60 line-clamp-2">
                        Update your username and avatar
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 hover:bg-base-200/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-base-content truncate">
                        Privacy & Security
                      </p>
                      <p className="text-xs sm:text-sm text-base-content/60 line-clamp-2">
                        Manage your privacy settings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-base-300 overflow-hidden">
            <div className="card-body p-0">
              <div className="p-3 sm:p-4 border-b border-base-300 bg-base-200/50">
                <h3 className="text-base sm:text-lg font-semibold text-base-content flex items-center gap-2">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-base-content/60 flex-shrink-0" />
                  <span className="truncate">Preferences</span>
                </h3>
              </div>
              <div className="divide-y divide-base-300">
                <div className="p-3 sm:p-4 hover:bg-base-200/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-base-content truncate">
                        Notifications
                      </p>
                      <p className="text-xs sm:text-sm text-base-content/60 line-clamp-2">
                        Manage notification preferences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-error overflow-hidden">
            <div className="card-body p-0">
              <div className="p-3 sm:p-4 border-b border-error bg-error/10">
                <h3 className="text-base sm:text-lg font-semibold text-error truncate">
                  Danger Zone
                </h3>
              </div>
              <div className="p-3 sm:p-4">
                <button
                  onClick={handleLogout}
                  className="btn btn-error w-full btn-sm sm:btn-md"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
