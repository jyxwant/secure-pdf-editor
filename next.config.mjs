/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Removed for Vercel deployment to support standard routing
  // images: {
  //   unoptimized: true, // Not required for Vercel
  // },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
