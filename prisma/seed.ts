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
