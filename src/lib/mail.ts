import { Resend } from "resend";

// Sender default "onboarding@resend.dev" cuma bisa kirim ke email pemilik akun
// Resend selama domain sendiri belum diverifikasi — cukup untuk admin tunggal/kecil.
// Ganti RESEND_FROM_EMAIL di .env.local setelah verifikasi domain kalau perlu.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "BaliInvitation <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY belum di-set di .env.local");
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset Password Admin BaliInvitation",
    html: `
      <p>Ada permintaan reset password untuk akun admin BaliInvitation kamu.</p>
      <p><a href="${resetUrl}">Klik di sini untuk mengatur password baru</a> (link berlaku 1 jam).</p>
      <p>Kalau kamu tidak meminta ini, abaikan saja email ini.</p>
    `,
  });
}
