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
    // File biner Chromium dibaca lewat path dinamis, jadi tidak terdeteksi
    // otomatis oleh file tracing Vercel — harus disertakan manual ke fungsi ini.
    outputFileTracingIncludes: {
      "/api/social/screens": ["./node_modules/@sparticuz/chromium/bin/**"],
    },
  },
};
module.exports = nextConfig;
