import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken, hashToken } from "@/lib/utils/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 jam

const schema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
});

// POST /api/auth/forgot-password -> kirim email reset kalau email terdaftar.
// Selalu balas sukses generik (tidak bocorkan apakah email terdaftar atau tidak).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });

  if (admin) {
    const rawToken = generatePasswordResetToken();
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        resetToken: hashToken(rawToken),
        resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetUrl = `${req.nextUrl.origin}/admin/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(admin.email, resetUrl);
    } catch (e) {
      console.error("Gagal kirim email reset password:", e);
      return NextResponse.json({ error: "Gagal mengirim email, coba lagi nanti" }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Kalau email terdaftar, link reset password sudah dikirim.",
  });
}
