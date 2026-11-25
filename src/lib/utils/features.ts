// Template.features seharusnya string[]; baris lama kadang tersimpan sebagai teks JSON
// ("[\"a\",\"b\"]") — normalisasikan supaya halaman yang membacanya tidak error.
export function normalizeFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    try {
      return normalizeFeatures(JSON.parse(value));
    } catch {
      return value.trim() ? [value.trim()] : [];
    }
  }
  return [];
}
