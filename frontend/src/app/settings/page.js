"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import useAuthStore from "@/store/authStore";
import { useSettings } from "@/hooks/settings/useSettings";
import ProfileSection from "@/components/settings/ProfileSection";
import SettingsSection from "@/components/settings/SettingsSection";
import { ArrowLeft, LogOut, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, verifyAuth } = useAuthStore();
  const {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    handleUpdateProfile,
    isButtonLoading,
    error,
    fieldErrors,
    clearError,
  } = useSettings();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyAuth();
      if (!isValid) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, verifyAuth]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-200 to-base-100">
      {/* Modern Header */}
      <div className="bg-base-100 border-b-2 border-base-300 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-200"
              aria-label="Back to chat"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <SettingsIcon className="h-5 w-5 text-primary-content" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-base-content truncate">
                  Settings
                </h1>
                <p className="text-xs sm:text-sm text-base-content/60">
                  Manage your account and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Profile Section */}
          <ProfileSection
            user={user}
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdateProfile={handleUpdateProfile}
            isButtonLoading={isButtonLoading}
            error={error}
            fieldErrors={fieldErrors}
            clearError={clearError}
          />

          {/* Settings Sections */}
          <SettingsSection />

          {/* Danger Zone */}
          <div className="card bg-base-100 shadow-xl border-2 border-error/30 overflow-hidden">
            <div className="card-body p-0">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-error/30 bg-error/5">
                <h3 className="text-base sm:text-lg font-bold text-error flex items-center gap-2">
                  <div className="w-1 h-6 bg-error rounded-full" />
                  Danger Zone
                </h3>
                <p className="text-xs sm:text-sm text-error/70 mt-1">
                  Irreversible actions
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <button
                  onClick={handleLogout}
                  className="btn btn-error w-full sm:w-auto gap-2"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
