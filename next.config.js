/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // add this line to emit a standalone build
  output: "standalone",
};

module.exports = nextConfig;
