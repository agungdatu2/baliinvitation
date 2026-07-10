export type GuestCategory = "keluarga" | "teman" | "rekan" | "lainnya";
export const GUEST_CATEGORIES: GuestCategory[] = ["keluarga", "teman", "rekan", "lainnya"];

export interface ParsedGuest {
  name: string;
  waNumber?: string;
  category: GuestCategory;
}

export interface BulkImportError {
  line: number;
  raw: string;
  reason: string;
}

export interface BulkImportResult {
  guests: ParsedGuest[];
  errors: BulkImportError[];
}

// Satu nama per baris, atau format CSV opsional "nama, no_wa, kategori".
// Baris kosong dilewati; nama wajib ada; kategori tidak dikenal jatuh ke "lainnya".
export function parseGuestBulkImport(text: string): BulkImportResult {
  const guests: ParsedGuest[] = [];
  const errors: BulkImportError[] = [];

  const lines = text.split("\n");
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;

    const parts = line.split(",").map((p) => p.trim());
    const name = parts[0];
    if (!name) {
      errors.push({ line: i + 1, raw, reason: "Nama kosong" });
      return;
    }

    const waNumber = parts[1] || undefined;
    const rawCategory = parts[2]?.toLowerCase();
    const category: GuestCategory = GUEST_CATEGORIES.includes(rawCategory as GuestCategory)
      ? (rawCategory as GuestCategory)
      : "lainnya";

    guests.push({ name, waNumber, category });
  });

  return { guests, errors };
}
