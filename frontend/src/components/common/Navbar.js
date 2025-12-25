"use client";

import { Menu, X, MessageCircle } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Navbar({ onMenuClick, showMobileSidebar, onNewChat }) {
  return (
    <div className="navbar bg-base-100/90 backdrop-blur-xl border-b-2 border-base-300 px-4 lg:px-6 h-16 shadow-lg relative z-[60]">
      <div className="flex-1 gap-3">
        <button
          className="btn btn-ghost btn-sm lg:hidden p-2 rounded-xl hover:bg-base-200"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          {showMobileSidebar ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md items-center justify-center flex-shrink-0">
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
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
