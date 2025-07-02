/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Enable SWC minification
  swcMinify: true,
};

module.exports = nextConfig;
