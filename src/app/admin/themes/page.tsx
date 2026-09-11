import { prisma } from "@/lib/prisma";
import ThemesManager from "@/components/admin/ThemesManager";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { invitations: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Tema</h1>
      <p className="text-sm text-gray-500 mb-6">
        Daftar tema yang bisa dipilih saat membuat undangan. Tema baru (komponen React-nya) tetap ditambahkan lewat
        kode di <code>src/components/templates</code> dan <code>registry.ts</code> — tapi tagline, deskripsi,
        checklist fitur, dan badge Most Popular yang tampil di landing page bisa diatur langsung dari sini.
      </p>
      <ThemesManager initialTemplates={templates.map((t) => ({ ...t, features: t.features as string[] }))} />
    </div>
  );
}
