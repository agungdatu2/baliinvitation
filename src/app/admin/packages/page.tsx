import { prisma } from "@/lib/prisma";
import PackagesManager from "@/components/admin/PackagesManager";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { price: "asc" },
    include: { _count: { select: { invitations: true } } },
  });

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Paket</h1>
      </div>
      <PackagesManager
        initialPackages={packages.map((p) => ({ ...p, features: p.features as string[] }))}
      />
    </div>
  );
}
