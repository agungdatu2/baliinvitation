import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin-users/[id] -> hapus akun admin. Diblokir kalau hasil
// akhirnya nol admin tersisa (biar tidak ada yang terkunci dari panel), atau
// kalau admin mencoba hapus akun dirinya sendiri (harus pakai akun lain).
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUserId = (session.user as { id?: string })?.id;
  if (currentUserId === params.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun yang sedang login" }, { status: 400 });
  }

  const total = await prisma.adminUser.count();
  if (total <= 1) {
    return NextResponse.json({ error: "Minimal harus ada 1 akun admin" }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
