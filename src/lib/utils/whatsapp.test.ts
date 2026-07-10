import { describe, it, expect } from "vitest";
import { normalizeWaNumber, buildWaLink } from "./whatsapp";

describe("normalizeWaNumber", () => {
  it("converts a leading 0 to 62", () => {
    expect(normalizeWaNumber("081234567890")).toBe("6281234567890");
  });

  it("strips spaces and dashes", () => {
    expect(normalizeWaNumber("0812-3456-7890")).toBe("6281234567890");
  });

  it("leaves an already-international number as-is", () => {
    expect(normalizeWaNumber("6281234567890")).toBe("6281234567890");
  });

  it("strips a leading +", () => {
    expect(normalizeWaNumber("+6281234567890")).toBe("6281234567890");
  });
});

describe("buildWaLink", () => {
  it("builds a wa.me link with an encoded message", () => {
    const link = buildWaLink("081234567890", "Halo & selamat");
    expect(link).toBe("https://wa.me/6281234567890?text=Halo%20%26%20selamat");
  });
});
