import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/utils/tokens";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

// POST /api/auth/reset-password -> validasi token dari email + set password baru.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors.password?.[0] || "Data tidak valid" }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { resetToken: hashToken(parsed.data.token) },
  });

  if (!admin || !admin.resetTokenExpiry || admin.resetTokenExpiry < new Date()) {
    return NextResponse.json({ error: "Link reset tidak valid atau sudah kedaluwarsa" }, { status: 400 });
  }

  const hash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { password: hash, resetToken: null, resetTokenExpiry: null },
  });

  return NextResponse.json({ ok: true });
}
