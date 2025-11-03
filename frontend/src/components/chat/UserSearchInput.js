"use client";

import { Search } from "lucide-react";

export default function UserSearchInput({
  value,
  onChange,
  placeholder = "Search users...",
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
      <input
        type="text"
        placeholder={placeholder}
        className="input input-bordered w-full pl-12 rounded-2xl focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
    </div>
  );
}
