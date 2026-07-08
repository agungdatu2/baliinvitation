import Link from "next/link";

const FEATURES = [
  { title: "Gate Personal", desc: "Sapaan \"Kepada Yth\" dengan nama tamu otomatis dari link undangan." },
  { title: "Cerita & Galeri", desc: "Love story dan galeri foto dinamis, jumlah dan urutan bebas diatur." },
  { title: "Countdown & Kalender", desc: "Hitung mundur hari-H plus tombol tambah ke Google Calendar." },
  { title: "Jadwal Acara", desc: "Kartu acara (resepsi, memadik, dst) lengkap dengan link Maps." },
  { title: "RSVP Tamu", desc: "Konfirmasi hadir, jumlah tamu, dan ucapan tersimpan otomatis." },
  { title: "Wedding Gift", desc: "Info rekening dengan tombol salin, tanpa perlu tanya manual." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-lume-bg text-lume-ink">
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-lume-gold mb-4">BaliInvitation</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Undangan Digital, Rapi Sejak Draft Pertama</h1>
        <p className="text-lume-ink/70 max-w-xl mx-auto mb-8">
          Buat, kelola, dan bagikan undangan pernikahan digital untuk tiap klien dari satu dashboard admin.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 rounded-lg bg-lume-ink text-white text-sm hover:bg-lume-ink/90 transition"
        >
          Buka Dashboard Admin
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-lume-line rounded-xl p-5 bg-white/50">
              <h3 className="font-serif text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-lume-ink/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-lume-ink/50 pb-10">
        BaliInvitation — Template Undangan Digital
      </footer>
    </main>
  );
}
