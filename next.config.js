/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // batasi ke domain CDN kamu di produksi
    ],
  },
};
module.exports = nextConfig;
