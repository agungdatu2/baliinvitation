import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminUserSchema } from "@/lib/validations/admin-user.schema";

// GET /api/admin-users -> list akun admin (tanpa field password)
export async function GET() {
  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return NextResponse.json(admins);
}

// POST /api/admin-users -> buat akun admin baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = adminUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  const existing = await prisma.adminUser.findUnique({ where: { email: d.email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar sebagai admin" }, { status: 409 });
  }

  const hash = await bcrypt.hash(d.password, 10);
  const created = await prisma.adminUser.create({
    data: { email: d.email, password: hash, name: d.name || null },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return NextResponse.json(created, { status: 201 });
}
