import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // enables static HTML export
  images: {
    unoptimized: true, // required for static export
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  trailingSlash: true, // adds /index.html in subpages
  reactStrictMode: true,
};
export default nextConfig;
