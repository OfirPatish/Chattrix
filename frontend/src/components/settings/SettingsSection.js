"use client";

import { User as UserIcon, ShieldCheck, Bell, Palette } from "lucide-react";

export default function SettingsSection() {
  return (
    <div className="space-y-4">
      {/* Account Settings */}
      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
        <div className="card-body p-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-200/30">
            <h3 className="text-base sm:text-lg font-bold text-base-content">
              Account
            </h3>
          </div>
          <div className="divide-y divide-base-300">
            <button className="w-full p-4 sm:p-5 hover:bg-base-200/50 transition-colors text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-base-content mb-1">
                    Profile Information
                  </p>
                  <p className="text-sm text-base-content/60">
                    Update your username and avatar
                  </p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 sm:p-5 hover:bg-base-200/50 transition-colors text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-base-content mb-1">
                    Privacy & Security
                  </p>
                  <p className="text-sm text-base-content/60">
                    Manage your privacy settings
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
        <div className="card-body p-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-200/30">
            <h3 className="text-base sm:text-lg font-bold text-base-content">
              Preferences
            </h3>
          </div>
          <div className="divide-y divide-base-300">
            <button className="w-full p-4 sm:p-5 hover:bg-base-200/50 transition-colors text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-base-content mb-1">
                    Notifications
                  </p>
                  <p className="text-sm text-base-content/60">
                    Manage notification preferences
                  </p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 sm:p-5 hover:bg-base-200/50 transition-colors text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base text-base-content mb-1">
                    Appearance
                  </p>
                  <p className="text-sm text-base-content/60">
                    Customize theme and display
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
