import { prisma } from "@/lib/prisma";

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

// Backed by Postgres (RateLimitHit) instead of an in-memory map — a plain in-memory
// counter doesn't hold up on Vercel, where each request can land on a different
// serverless instance. Best-effort, not perfectly atomic, but sufficient for
// abuse-guarding an internal endpoint (not a payments-grade limiter).
export async function checkRateLimit(key: string, { windowMs, max }: RateLimitOptions): Promise<boolean> {
  const now = new Date();
  const existing = await prisma.rateLimitHit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await prisma.rateLimitHit.upsert({
      where: { key },
      create: { key, windowStart: now, count: 1 },
      update: { windowStart: now, count: 1 },
    });
    return true;
  }

  if (existing.count >= max) return false;

  await prisma.rateLimitHit.update({ where: { key }, data: { count: { increment: 1 } } });
  return true;
}
