import { describe, it, expect } from "vitest";
import { generateGuestCode, generatePortalToken } from "./tokens";

describe("generateGuestCode", () => {
  it("is 8 characters from the non-ambiguous alphabet", () => {
    const code = generateGuestCode();
    expect(code).toHaveLength(8);
    expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{8}$/);
  });

  it("does not contain ambiguous characters (0/O/1/I/L)", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateGuestCode()).not.toMatch(/[01OIL]/i);
    }
  });

  it("is non-sequential — many draws are all unique", () => {
    const codes = new Set(Array.from({ length: 500 }, () => generateGuestCode()));
    expect(codes.size).toBe(500);
  });
});

describe("generatePortalToken", () => {
  it("is a 32-char hex string", () => {
    const token = generatePortalToken();
    expect(token).toHaveLength(32);
    expect(token).toMatch(/^[0-9a-f]{32}$/);
  });

  it("is unique across many draws", () => {
    const tokens = new Set(Array.from({ length: 500 }, () => generatePortalToken()));
    expect(tokens.size).toBe(500);
  });
});
