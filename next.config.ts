import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Los headers de seguridad (CSP, X-Frame-Options, etc.) se aplican
  // globalmente vía src/middleware.ts para mayor control por ruta.
};

export default nextConfig;
