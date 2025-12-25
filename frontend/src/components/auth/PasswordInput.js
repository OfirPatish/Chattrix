"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import FormInput from "./FormInput";

export default function PasswordInput({
  label,
  showPasswordToggle = true,
  rightElement,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = props.id || `password-${label?.toLowerCase().replace(/\s+/g, "-") || Math.random().toString(36).substring(7)}`;

  return (
    <div className="form-control">
      <label htmlFor={inputId} className="label pb-2">
        <span className="label-text font-semibold text-sm sm:text-base">
          {label}
        </span>
        {rightElement}
      </label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 pointer-events-none z-10" />
        <input
          {...props}
          id={inputId}
          type={showPassword ? "text" : "password"}
          className={`input input-bordered input-lg w-full text-sm sm:text-base pl-12 ${
            showPasswordToggle ? "pr-12" : "pr-4"
          } relative z-0 focus:outline-none ${
            props.error ? "input-error" : ""
          } ${props.className || ""}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-base-content hover:bg-base-200 z-20"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {props.error && (
        <label className="label">
          <span className="label-text-alt text-error">{props.error}</span>
        </label>
      )}
    </div>
  );
}
