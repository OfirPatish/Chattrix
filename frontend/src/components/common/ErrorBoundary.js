"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { AlertCircle, RefreshCw, Home, Bug } from "lucide-react";
import Link from "next/link";

function ErrorFallback({ error, resetErrorBoundary }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-200 to-base-300 p-4">
      <div className="card bg-base-100 shadow-2xl max-w-lg w-full border border-base-300">
        <div className="card-body items-center text-center p-6 sm:p-8">
          {/* Error Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-error/20 to-error/10 flex items-center justify-center mb-6 animate-pulse">
            <AlertCircle className="h-12 w-12 text-error" />
          </div>

          {/* Error Title */}
          <h2 className="card-title text-2xl sm:text-3xl mb-2 text-error">
            Oops! Something went wrong
          </h2>

          {/* Error Message */}
          <div className="w-full mb-6">
            <p className="text-base-content/70 text-sm sm:text-base mb-2">
              {error?.message || "An unexpected error occurred"}
            </p>
            <p className="text-base-content/50 text-xs sm:text-sm">
              Don&apos;t worry, your data is safe. Try refreshing the page or go
              back home.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-center flex-col sm:flex-row gap-2 w-full">
            <button
              onClick={resetErrorBoundary}
              className="btn btn-primary gap-2 flex-1 sm:flex-none"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="btn btn-outline gap-2 flex-1 sm:flex-none"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>

          {/* Development Error Details */}
          {isDev && error?.stack && (
            <details className="mt-6 w-full text-left collapse collapse-arrow bg-base-200 rounded-lg">
              <summary className="collapse-title cursor-pointer text-sm font-medium text-base-content/70 hover:text-base-content flex items-center gap-2 py-3">
                <Bug className="h-4 w-4" />
                <span>Error Details (Development Only)</span>
              </summary>
              <div className="collapse-content">
                <div className="mt-2 p-4 bg-base-300 rounded-lg">
                  <p className="text-xs font-semibold text-error mb-2">
                    {error.name || "Error"}
                  </p>
                  <pre className="text-xs text-base-content/80 overflow-auto max-h-64 font-mono bg-base-100 p-3 rounded border border-base-300">
                    {error.stack}
                  </pre>
                </div>
              </div>
            </details>
          )}

          {/* Error Code for Production */}
          {!isDev && error?.message && (
            <div className="mt-4 p-3 bg-base-200 rounded-lg w-full">
              <p className="text-xs text-base-content/60">
                Error Code:{" "}
                <span className="font-mono">{error.name || "UNKNOWN"}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console or error reporting service
        console.error("Error caught by boundary:", error, errorInfo);

        // In production, you could send this to an error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });
      }}
      onReset={() => {
        // Optional: Clear any error state when resetting
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
