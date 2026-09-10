import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/landing/ScrollReveal";

export const dynamic = "force-dynamic";

function formatEventDate(d: Date) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export default async function ContohUndanganPage() {
  const invitations = await prisma.invitation.findMany({
    where: { showAsExample: true, status: "published" },
    include: { template: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-groove-ink text-groove-bg font-groove-body">
      <header className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-groove-display text-lg tracking-wide" style={{ fontWeight: 600 }}>
          BaliInvitation
        </Link>
        <Link href="/" className="text-sm text-groove-bg/50 hover:text-groove-bg transition-colors">
          ← Kembali
        </Link>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-8 pb-20">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-xs text-groove-primary-light mb-4">Contoh Undangan</p>
          <h1 className="font-groove-display text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
            Lihat Undangan yang Sudah Jadi
          </h1>
          <p className="text-groove-bg/60 mt-4 max-w-lg mx-auto text-sm">
            Data pasangan di bawah ini contoh (bukan client asli) — untuk melihat pengalaman lengkap sebuah undangan
            yang sudah dipublikasikan.
          </p>
        </div>

        {invitations.length === 0 ? (
          <p className="text-center text-groove-bg/50 text-sm">Belum ada contoh undangan yang dipublikasikan.</p>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv, i) => (
              <ScrollReveal key={inv.id} delay={i * 100}>
                <a
                  href={`/${inv.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 border border-groove-line-dark rounded-2xl px-6 py-5 bg-groove-bg/5 hover:bg-groove-bg/10 transition-colors"
                >
                  <div>
                    <h2 className="font-groove-display text-2xl mb-1" style={{ fontWeight: 500 }}>
                      {inv.groomNickname} &amp; {inv.brideNickname}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-groove-primary-light">
                      {inv.template.name}
                    </p>
                    <p className="text-sm text-groove-bg/50 mt-1">{formatEventDate(inv.eventDate)}</p>
                  </div>
                  <span className="text-groove-bg/60 text-sm whitespace-nowrap">Lihat →</span>
                </a>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
