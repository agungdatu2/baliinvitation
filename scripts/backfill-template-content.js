const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CONTENT = {
  lume: {
    tagline: "Elegant Minimalist",
    description: "Kertas hangat & emas pudar — clean, timeless, cocok untuk gaya formal-klasik.",
    features: ["Font Cormorant + Hanken Grotesk", "Background bertekstur kertas hangat", "Cocok gaya formal & klasik"],
  },
  reverie: {
    tagline: "Editorial Split",
    description: "Panel foto besar sticky di samping konten yang scroll — dramatis & modern.",
    features: ["Panel foto sticky di layar desktop", "Layout split editorial", "Scroll-snap antar section"],
  },
  muse: {
    tagline: "Editorial Free Scroll",
    description: "Turunan Reverie yang lebih santai, hero eyebrow-nama-tanggal yang bersih.",
    features: ["Scroll bebas tanpa snap", "Hero eyebrow-nama-tanggal bersih", "Nuansa lebih santai & ringan"],
  },
};

async function main() {
  for (const [key, data] of Object.entries(CONTENT)) {
    const result = await prisma.template.updateMany({ where: { key }, data });
    console.log(key, "updated:", result.count);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
