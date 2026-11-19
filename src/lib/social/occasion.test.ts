import { describe, expect, it } from "vitest";
import { getOccasion } from "./occasion";

describe("getOccasion", () => {
  it("keeps the wedding wording for wedding templates", () => {
    const o = getOccasion({ category: "wedding", groom: "Made", bride: "Ayu" });
    expect(o.label).toBe("THE WEDDING OF");
    expect(o.nameLines).toEqual(["Made &", "Ayu"]);
    expect(o.caption("Reverie")).toContain("Happy wedding Made & Ayu");
    expect(o.caption("Reverie")).toContain("#undanganpernikahan");
  });

  it("uses the child's name and age for birthdays", () => {
    const o = getOccasion({ category: "ulang-tahun", groom: "", bride: "", hostName: "Aluna Rania Tayana", eventTitle: "Ulang Tahun ke-1" });
    expect(o.label).toBe("THE 1ST BIRTHDAY OF");
    expect(o.nameLines).toEqual(["Aluna Rania Tayana"]);
    expect(o.caption("Confetti")).toContain("Happy birthday Aluna Rania Tayana");
    expect(o.caption("Confetti")).toContain("#undanganulangtahun");
    expect(o.caption("Confetti")).not.toContain("wedding");
  });

  it("falls back without an age", () => {
    const o = getOccasion({ category: "ulang-tahun", groom: "", bride: "", hostName: "Dewi", eventTitle: "Birthday Party" });
    expect(o.label).toBe("THE BIRTHDAY OF");
  });

  it("uses the event title for business/ritual events", () => {
    const o = getOccasion({ category: "melaspas", groom: "", bride: "", hostName: "Surya Perkasa Motor", eventTitle: "Grand Opening" });
    expect(o.label).toBe("GRAND OPENING");
    expect(o.caption("Grand Opening")).toContain("grand opening Surya Perkasa Motor");
    expect(o.caption("Grand Opening")).not.toContain("wedding");
  });

  it("falls back to the wedding layout when a non-wedding invitation has no host name", () => {
    const o = getOccasion({ category: "melaspas", groom: "A", bride: "B", hostName: "" });
    expect(o.label).toBe("THE WEDDING OF");
  });
});
