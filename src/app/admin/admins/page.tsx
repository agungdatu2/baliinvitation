import { prisma } from "@/lib/prisma";
import AdminUsersManager from "@/components/admin/AdminUsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Akun Admin</h1>
      </div>
      <AdminUsersManager initialAdmins={admins.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))} />
    </div>
  );
}
