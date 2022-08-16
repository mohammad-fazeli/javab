/** @type {import('next').NextConfig} */
console.log(process.env.IMAGE_HOSTNAME);
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.IMAGE_HOSTNAME],
  },
};

module.exports = nextConfig;
