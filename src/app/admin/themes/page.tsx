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
        Daftar tema yang bisa dipilih saat membuat undangan. Menambah tema di sini hanya mendaftarkan key & nama —
        komponen React-nya tetap perlu dibuat terpisah di <code>src/components/templates</code> dan didaftarkan di{" "}
        <code>registry.ts</code>.
      </p>
      <ThemesManager initialTemplates={templates} />
    </div>
  );
}
