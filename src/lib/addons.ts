// Harga add-on — satu sumber kebenaran untuk landing page ("Fitur Tambahan")
// dan perhitungan totalPrice undangan di admin. Samakan dengan daftar harga resmi.
export const ADDON_PRICES = {
  eventSession: 100000, // Tambahan sesi acara / 2 link jadwal berbeda
  coverVideo: 30000, // Ubah cover asli jadi video
  galleryQuota: 35000, // Tambah kuota galeri foto
  bilingual: 100000, // Undangan multi-bahasa (ID/EN)
  lifetime: 100000, // Link aktif seumur hidup
} as const;

export interface AddonFlags {
  isAddon: boolean;
  coverVideoAddon: boolean;
  extraGalleryAddon: boolean;
  bilingualEnabled: boolean;
  neverExpires: boolean;
}

export function addonTotal(f: AddonFlags): number {
  return (
    (f.isAddon ? ADDON_PRICES.eventSession : 0) +
    (f.coverVideoAddon ? ADDON_PRICES.coverVideo : 0) +
    (f.extraGalleryAddon ? ADDON_PRICES.galleryQuota : 0) +
    (f.bilingualEnabled ? ADDON_PRICES.bilingual : 0) +
    (f.neverExpires ? ADDON_PRICES.lifetime : 0)
  );
}

// Total tagihan = harga paket + add-on yang dicentang. Khusus undangan add-on
// (isAddon: link jadwal kedua untuk client yang sama) harga paket TIDAK dihitung —
// hanya harga add-on. null = tidak ada paket & tidak ada add-on (tidak ditagih).
export function calcTotalPrice(packagePrice: number | null, f: AddonFlags): number | null {
  const addons = addonTotal(f);
  if (packagePrice == null && addons === 0) return null;
  const base = f.isAddon ? 0 : packagePrice ?? 0;
  return base + addons;
}
