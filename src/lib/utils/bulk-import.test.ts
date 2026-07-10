import { describe, it, expect } from "vitest";
import { parseGuestBulkImport } from "./bulk-import";

describe("parseGuestBulkImport", () => {
  it("parses one name per line", () => {
    const { guests, errors } = parseGuestBulkImport("Budi\nSiti\nAgus");
    expect(errors).toHaveLength(0);
    expect(guests).toEqual([
      { name: "Budi", waNumber: undefined, category: "lainnya" },
      { name: "Siti", waNumber: undefined, category: "lainnya" },
      { name: "Agus", waNumber: undefined, category: "lainnya" },
    ]);
  });

  it("parses CSV form: nama, no_wa, kategori", () => {
    const { guests } = parseGuestBulkImport("Budi, 08123456789, keluarga");
    expect(guests).toEqual([{ name: "Budi", waNumber: "08123456789", category: "keluarga" }]);
  });

  it("falls back to 'lainnya' for an unknown category", () => {
    const { guests } = parseGuestBulkImport("Budi, 08123456789, sahabat_dekat");
    expect(guests[0].category).toBe("lainnya");
  });

  it("skips blank lines", () => {
    const { guests, errors } = parseGuestBulkImport("Budi\n\n   \nSiti");
    expect(errors).toHaveLength(0);
    expect(guests).toHaveLength(2);
  });

  it("reports an error for a line with no name (leading comma)", () => {
    const { guests, errors } = parseGuestBulkImport(", 08123456789, keluarga");
    expect(guests).toHaveLength(0);
    expect(errors).toEqual([{ line: 1, raw: ", 08123456789, keluarga", reason: "Nama kosong" }]);
  });

  it("trims whitespace around each field", () => {
    const { guests } = parseGuestBulkImport("  Budi  ,  08123  ,  teman  ");
    expect(guests[0]).toEqual({ name: "Budi", waNumber: "08123", category: "teman" });
  });

  it("is case-insensitive for category", () => {
    const { guests } = parseGuestBulkImport("Budi,,KELUARGA");
    expect(guests[0].category).toBe("keluarga");
  });
});
