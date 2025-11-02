"use client";

import { UserPlus } from "lucide-react";

export default function EmptyState({
  icon,
  title,
  description,
  onAction,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-base-content/70 relative">
      <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
        {typeof icon === "string" ? (
          <span className="text-4xl">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <p className="text-base font-medium text-base-content/80 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-base-content/60 mb-6">{description}</p>
      )}
      {onAction && (
        <button onClick={onAction} className="btn btn-primary gap-2">
          <UserPlus className="h-5 w-5" />
          {actionLabel || "New Chat"}
        </button>
      )}
    </div>
  );
}
