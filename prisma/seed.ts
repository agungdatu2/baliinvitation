import { PrismaClient } from "@prisma/client";
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
}

main().finally(() => prisma.$disconnect());
