"use client";

export default function AuthLayout({ title, subtitle, children, footerText }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4">
            {title}
          </h1>
          <p className="text-base-content/60 text-base sm:text-lg px-4">
            {subtitle}
          </p>
        </div>

        {/* Card */}
        <div className="card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-300/50">
          <div className="card-body p-6 sm:p-8 md:p-10">{children}</div>
        </div>

        {/* Footer */}
        {footerText && (
          <p className="text-center text-[10px] sm:text-xs text-base-content/40 mt-4 sm:mt-6 px-4">
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
}
