/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};
export default nextConfig;
