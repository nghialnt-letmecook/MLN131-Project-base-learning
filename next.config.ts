import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: "standalone", // Tạm thời comment để tránh lỗi symlink trên Windows
    experimental: {
        cpus: 4
    },
};

export default nextConfig;
