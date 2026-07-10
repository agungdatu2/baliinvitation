import { describe, it, expect, vi } from "vitest";

const store = new Map<string, { windowStart: Date; count: number }>();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    rateLimitHit: {
      findUnique: vi.fn(({ where: { key } }: { where: { key: string } }) => store.get(key) ?? null),
      upsert: vi.fn(({ where: { key }, create }: { where: { key: string }; create: { windowStart: Date; count: number } }) => {
        store.set(key, { ...create });
        return store.get(key);
      }),
      update: vi.fn(
        ({ where: { key }, data }: { where: { key: string }; data: { count: { increment: number } } }) => {
          const row = store.get(key)!;
          row.count += data.count.increment;
          return row;
        }
      ),
    },
  },
}));

const { checkRateLimit } = await import("./rate-limit");

describe("checkRateLimit", () => {
  it("allows up to max hits within the window, then blocks", async () => {
    const key = "test:max-2";
    expect(await checkRateLimit(key, { windowMs: 60_000, max: 2 })).toBe(true);
    expect(await checkRateLimit(key, { windowMs: 60_000, max: 2 })).toBe(true);
    expect(await checkRateLimit(key, { windowMs: 60_000, max: 2 })).toBe(false);
  });

  it("resets once the window has elapsed", async () => {
    const key = "test:window-reset";
    expect(await checkRateLimit(key, { windowMs: 50, max: 1 })).toBe(true);
    expect(await checkRateLimit(key, { windowMs: 50, max: 1 })).toBe(false);

    // simulate the window having passed
    store.set(key, { windowStart: new Date(Date.now() - 1000), count: 1 });
    expect(await checkRateLimit(key, { windowMs: 50, max: 1 })).toBe(true);
  });

  it("treats each key independently", async () => {
    expect(await checkRateLimit("test:a", { windowMs: 60_000, max: 1 })).toBe(true);
    expect(await checkRateLimit("test:b", { windowMs: 60_000, max: 1 })).toBe(true);
  });
});
