import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  await prisma.template.upsert({
    where: { key: "lume" },
    update: {},
    create: { key: "lume", name: "Lume - Elegant Minimalist" },
  });
  await prisma.template.upsert({
    where: { key: "reverie" },
    update: {},
    create: { key: "reverie", name: "Reverie - Editorial Split" },
  });
  await prisma.template.upsert({
    where: { key: "muse" },
    update: {},
    create: { key: "muse", name: "Muse - Editorial Free Scroll" },
  });
  await prisma.template.upsert({
    where: { key: "confetti" },
    update: {},
    create: {
      key: "confetti",
      name: "Confetti - Pastel & Ceria",
      tagline: "Pastel & Ceria",
      description: "Tema ulang tahun anak yang ceria: konfeti pastel melayang, countdown berwarna-warni, dan galeri foto gaya polaroid.",
      features: ["Konfeti pastel dengan animasi lembut", "Countdown berwarna-warni", "Galeri polaroid dengan tampilan penuh"],
      category: "ulang-tahun",
    },
  });

  // Bootstrap akun admin pertama dari ADMIN_EMAIL/ADMIN_PASSWORD di .env — cuma
  // jalan kalau keduanya di-set, supaya seed tetap aman dijalankan berkali-kali
  // (mis. di CI) tanpa bikin admin dummy tak sengaja.
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { password: hash },
      create: { email: adminEmail, password: hash, name: "Admin" },
    });
    console.log(`Admin user siap: ${adminEmail}`);
  }
}

main().finally(() => prisma.$disconnect());
