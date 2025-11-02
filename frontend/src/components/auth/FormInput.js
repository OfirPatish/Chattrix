"use client";

import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

const FormInput = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      showLabel = true,
      rightElement,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="form-control">
        {showLabel && (
          <label className="label pb-2">
            <span className="label-text font-semibold text-sm sm:text-base">
              {label}
            </span>
            {rightElement}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/60 pointer-events-none z-10" />
          )}
          <input
            ref={ref}
            className={`input input-bordered input-lg w-full text-sm sm:text-base ${
              Icon ? "pl-12" : "pl-4"
            } ${rightElement ? "pr-12" : "pr-4"} relative z-0 ${
              error ? "input-error" : "focus:input-primary"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

