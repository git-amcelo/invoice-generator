import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use export mode in production, not in development
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  // Fix html2pdf.js compatibility issues
  webpack: (config) => {
    // Define global variables for html2pdf.js
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false, // Disable canvas dependency
    };
    return config;
  },
};

// Fix for html2pdf.js 'self is not defined' error
if (typeof global !== 'undefined') {
  global.self = global.self || {};
}

export default nextConfig;
