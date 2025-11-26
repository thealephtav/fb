import type { NextConfig } from "next";
import { MAX_PFP_SIZE_BYTES } from "./lib/constants";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Allow larger payloads for profile photo uploads (default is 1MB)
      bodySizeLimit: MAX_PFP_SIZE_BYTES,
    },
  },
};

export default nextConfig;
