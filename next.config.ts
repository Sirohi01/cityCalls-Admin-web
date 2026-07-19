import type { NextConfig } from "next";

// Local-provider file URLs resolve against citycalls-api's own origin (see
// resolveFileUrl in src/lib/hooks/useFiles.ts) — next/image needs that host
// explicitly allowed, same as Cloudinary's, or it refuses to render it.
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      {
        protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: apiOrigin.hostname,
        port: apiOrigin.port || undefined,
      },
    ],
  },
};

export default nextConfig;
