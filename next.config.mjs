/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const target = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${target}/health`,
      },
    ];
  },
};

export default nextConfig;

