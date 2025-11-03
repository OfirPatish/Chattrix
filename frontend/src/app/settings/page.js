"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { useSettings } from "@/hooks/settings/useSettings";
import ProfileSection from "@/components/settings/ProfileSection";
import SettingsSection from "@/components/settings/SettingsSection";
import { ArrowLeft, LogOut } from "lucide-react";

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
        <ProfileSection
          user={user}
          profileData={profileData}
          setProfileData={setProfileData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onUpdateProfile={handleUpdateProfile}
          isButtonLoading={isButtonLoading}
        />

        <SettingsSection />

        {/* Danger Zone */}
        <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-error overflow-hidden mt-4 sm:mt-6">
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
  );
}
