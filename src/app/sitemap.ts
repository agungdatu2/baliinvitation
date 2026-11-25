import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://baliinvitation.com";

// Disegarkan tiap jam (bukan tiap request) supaya ringan; tema baru otomatis
// masuk begitu aktif di tabel Template. Undangan client sengaja TIDAK dimasukkan
// (itu halaman pribadi yang dibagikan lewat link, bukan konten pemasaran).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/contoh-undangan`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const themes = await prisma.template.findMany({ where: { isActive: true }, select: { key: true }, orderBy: { createdAt: "asc" } });
    for (const t of themes) {
      entries.push({ url: `${BASE_URL}/theme-preview/${t.key}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
    }
  } catch {
    // Kalau DB tidak terjangkau saat build, sitemap tetap valid tanpa halaman tema.
  }
  return entries;
}
