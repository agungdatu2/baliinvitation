import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.template.upsert({
    where: { key: "lume" },
    update: {},
    create: { key: "lume", name: "Lume - Elegant Minimalist" },
  });
}

main().finally(() => prisma.$disconnect());
