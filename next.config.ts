import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["exceljs", "pg"],
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  poweredByHeader: false,
};

export default nextConfig;
