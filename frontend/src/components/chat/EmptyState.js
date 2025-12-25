"use client";

import { motion } from "motion/react";
import { UserPlus } from "lucide-react";

export default function EmptyState({
  icon,
  title,
  description,
  onAction,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-base-content/70 relative px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center mb-6 shadow-lg"
      >
        {typeof icon === "string" ? (
          <span className="text-5xl">{icon}</span>
        ) : (
          <div className="scale-125">{icon}</div>
        )}
      </motion.div>
      <p className="text-lg font-bold text-base-content mb-2">{title}</p>
      {description && (
        <p className="text-sm text-base-content/70 mb-8 max-w-sm text-center">
          {description}
        </p>
      )}
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <UserPlus className="h-5 w-5" />
          {actionLabel || "New Chat"}
        </button>
      )}
    </div>
  );
}
