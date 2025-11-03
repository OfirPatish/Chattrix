/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enable static export for Render Static Site
  images: {
    unoptimized: true, // Required for static export
  },
  // Note: The lockfile warning is harmless in monorepo setups.
  // Next.js detects both root and frontend package-lock.json files,
  // but this doesn't affect functionality. Both lockfiles are needed
  // for the monorepo structure (root for scripts, frontend for dependencies).
};

export default nextConfig;
