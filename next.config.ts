import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        cpus: 4
    },
    images: {
        unoptimized: true,
        remotePatterns: [],
    },
};

export default nextConfig;
