"use client";

import { AlertCircle } from "lucide-react";

export default function ErrorDisplay({ error, className = "" }) {
  if (!error) return <div className="mb-4 sm:mb-6 min-h-[3.5rem]"></div>;

  return (
    <div className={`mb-4 sm:mb-6 min-h-[3.5rem] ${className}`}>
      <div className="alert alert-error shadow-lg text-sm sm:text-base">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <span className="font-medium break-words">{error}</span>
      </div>
    </div>
  );
}

