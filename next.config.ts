import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Pass image URLs directly to the browser instead of proxying through
    // the Next.js image-optimisation server.  This keeps the dev server
    // free of 500 errors in environments without outbound internet access
    // (e.g. CI, sandboxes).  Remove this flag and configure a proper CDN
    // or the built-in optimizer when deploying to production.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
