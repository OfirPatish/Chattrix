"use client";

export default function SubmitButton({
  isLoading,
  loadingText,
  children,
  className = "",
  ...props
}) {
  return (
    <div className={`form-control mt-6 sm:mt-8 ${className}`}>
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl min-h-[3rem] sm:min-h-[3.5rem] text-sm sm:text-base"
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span>{loadingText}</span>
          </span>
        ) : (
          <span>{children}</span>
        )}
      </button>
    </div>
  );
}

