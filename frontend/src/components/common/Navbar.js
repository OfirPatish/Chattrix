"use client";

import { Menu, X, MessageCircle } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Navbar({ onMenuClick, showMobileSidebar, onNewChat }) {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-xl border-b border-base-300 px-4 lg:px-6 h-16 shadow-sm relative z-[60]">
      <div className="flex-1 gap-3">
        <button
          className="btn btn-ghost btn-sm lg:hidden p-2 rounded-xl"
          onClick={onMenuClick}
        >
          {showMobileSidebar ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="avatar placeholder"></div>
          <span className="text-xl font-semibold hidden sm:inline">
            Chattrix
          </span>
        </div>
      </div>
      <div className="flex-none gap-2 items-center">
        {/* User Profile Dropdown */}
        <UserProfileDropdown onNewChat={onNewChat} />
      </div>
    </div>
  );
}
