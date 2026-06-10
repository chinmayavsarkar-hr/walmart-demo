import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Multiple lockfiles exist above this folder; pin the workspace root so
  // Turbopack doesn't infer the wrong one.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
