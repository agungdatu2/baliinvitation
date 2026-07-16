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
        Daftar tema yang bisa dipilih saat membuat undangan. Tema baru ditambahkan lewat kode (komponen React di{" "}
        <code>src/components/templates</code>, didaftarkan di <code>registry.ts</code>), bukan dari sini.
      </p>
      <ThemesManager initialTemplates={templates} />
    </div>
  );
}
