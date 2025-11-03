"use client";

import { Settings, User as UserIcon, ShieldCheck, Bell } from "lucide-react";

export default function SettingsSection() {
  return (
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
            {/* Logout button will be passed as children or prop */}
          </div>
        </div>
      </div>
    </div>
  );
}
