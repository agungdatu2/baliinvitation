import Link from "next/link";

// Toggle ID/EN mengambang di pojok KIRI atas — cuma dirender di [slug]/page.tsx
// kalau invitation.bilingualEnabled true. Sengaja di kiri (bukan kanan): hampir
// semua tema (Lume/Nocturne/Muse/Reverie) sudah punya tombol hamburger nav
// persis di fixed top-6 right-6, jadi kanan-atas akan tabrakan. Server
// component murni (Link biasa, bukan client state) supaya ganti bahasa =
// navigasi ulang halaman dengan query `?lang=` baru, otomatis konsisten di
// SEMUA tema tanpa perlu context client-side yang harus di-thread ke 30+
// komponen template.
export default function LanguageToggle({
  currentLang,
  searchParams,
}: {
  currentLang: "id" | "en";
  searchParams: Record<string, string | undefined>;
}) {
  const buildHref = (lang: "id" | "en") => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "lang") params.set(key, value);
    }
    params.set("lang", lang);
    return `?${params.toString()}`;
  };

  return (
    <div className="fixed top-6 left-6 z-[9999] flex items-center gap-0.5 rounded-full bg-black/70 backdrop-blur px-1 py-1 text-xs text-white shadow-lg">
      <Link
        href={buildHref("id")}
        className={`px-2.5 py-1 rounded-full transition ${
          currentLang === "id" ? "bg-white text-black font-medium" : "text-white/70 hover:text-white"
        }`}
      >
        ID
      </Link>
      <Link
        href={buildHref("en")}
        className={`px-2.5 py-1 rounded-full transition ${
          currentLang === "en" ? "bg-white text-black font-medium" : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
