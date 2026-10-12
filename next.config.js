/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // batasi ke domain CDN kamu di produksi
    ],
  },
  // Chromium + puppeteer dipakai route generator screenshot sosmed — harus
  // dibiarkan sebagai package eksternal (tidak di-bundle webpack) karena
  // berisi binary & loader dinamis.
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
};
module.exports = nextConfig;
