import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enable static export for Render Static Site
  images: {
    unoptimized: true, // Required for static export
  },
  // Set turbopack root to suppress lockfile warning in monorepo
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
};

export default nextConfig;
