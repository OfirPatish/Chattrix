"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { getAvatarUrl } from "@/utils/avatarUtils";
import Image from "next/image";
import { UserPlus, LogOut, Settings, ChevronDown, User } from "lucide-react";

export default function UserProfileDropdown({ onNewChat }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const detailsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target) &&
        detailsRef.current.open
      ) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <details
      ref={detailsRef}
      className="dropdown dropdown-end dropdown-bottom group"
    >
      <summary className="btn btn-ghost gap-2 rounded-full cursor-pointer list-none">
        <div className="avatar placeholder">
          {getAvatarUrl(user?.avatar, user?.username) ? (
            <div className="rounded-full w-8 h-8 ring-2 ring-base-100 shadow-md overflow-hidden">
              <Image
                src={getAvatarUrl(user?.avatar, user?.username)}
                alt={user?.username || "Avatar"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-8 h-8 ring-2 ring-base-100 shadow-md flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
        <span className="font-medium text-sm text-base-content hidden sm:inline truncate max-w-[120px]">
          {user?.username}
        </span>
        <ChevronDown className="h-4 w-4 text-base-content/60 transition-transform group-open:rotate-180 hidden sm:inline" />
      </summary>
      <ul className="menu menu-sm dropdown-content bg-base-100 rounded-2xl w-56 p-2 shadow-xl border border-base-300 z-[200] mt-2">
        <li>
          <a onClick={handleNewChat} className="gap-3">
            <UserPlus className="h-5 w-5" />
            <span>New Chat</span>
          </a>
        </li>
        <li>
          <Link href="/settings" className="gap-3">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </li>
        <li className="pointer-events-none">
          <div className="h-0 border-t border-base-300 my-1"></div>
        </li>
        <li>
          <a onClick={handleLogout} className="text-error">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </details>
  );
}
