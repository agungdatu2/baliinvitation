import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85";

// lucide-react tidak menyediakan logo brand (Instagram dst.), jadi glyph-nya inline SVG sendiri.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Section "The Groom" — TANPA background foto full-viewport sendiri (beda dari
// versi sebelumnya): foto tampil sebagai kartu terkontain (aspect-square) dengan
// margin di kiri-kanan, sisanya transparan mengikuti FixedBackground milik
// MuseTemplate. Instagram handle overlay di dalam pojok kiri-bawah kartu foto,
// nama & orang tua tampil di bawah kartu (bukan overlay di atas foto).
export default function GroomSection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);

  return (
    <section className="relative py-20 md:py-28 px-6 flex flex-col items-center text-center text-groove-bg">
      <div className="relative w-full max-w-sm aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.groomPhoto || DEFAULT_PHOTO}
          alt={data.groomFullName}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {data.groomInstagram && (
          <div className="absolute inset-x-0 bottom-0 pt-10 pb-4 px-4 bg-gradient-to-t from-black/55 to-transparent">
            <a
              href={`https://instagram.com/${data.groomInstagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-groove-label text-sm text-white"
            >
              <InstagramIcon className="h-5 w-5" /> {data.groomNickname}
            </a>
          </div>
        )}
      </div>

      <p className="font-groove-label text-xs uppercase tracking-[0.35em] text-groove-bg/70 mt-10 mb-3">
        {t.theGroom}
      </p>
      <h2 className="font-reverie-display text-3xl md:text-4xl mb-6" style={{ fontWeight: 500 }}>
        {data.groomFullName}
      </h2>
      <p className="font-groove-body text-sm text-groove-bg/85 leading-relaxed">{t.sonOf}</p>
      <p className="font-groove-body text-sm text-groove-bg/85 leading-relaxed max-w-xs">{data.groomParents}</p>
    </section>
  );
}
