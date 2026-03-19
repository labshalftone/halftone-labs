import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow a second dev instance (e.g. preview tool) to use a separate dist dir
  // so it doesn't conflict with the primary dev server's .next/dev/lock
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
