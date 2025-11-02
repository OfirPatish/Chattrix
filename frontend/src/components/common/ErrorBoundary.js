"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-error" />
          </div>
          <h2 className="card-title text-2xl mb-2">Something went wrong</h2>
          <p className="text-base-content/60 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <div className="card-actions">
            <button
              onClick={resetErrorBoundary}
              className="btn btn-primary gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
          {process.env.NODE_ENV === "development" && error?.stack && (
            <details className="mt-4 w-full text-left">
              <summary className="cursor-pointer text-sm text-base-content/60">
                Error details (dev only)
              </summary>
              <pre className="mt-2 p-4 bg-base-200 rounded text-xs overflow-auto max-h-64">
                {error.stack}
              </pre>
            </details>
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
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
