import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85";

// lucide-react tidak menyediakan logo brand (Instagram dst.), jadi glyph-nya inline SVG sendiri
// (sama seperti pattern di GroomSection.tsx).
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// Section "The Bride" — kembaran GroomSection.tsx (foto pengantin wanita sendiri
// sebagai background full-viewport, z-index & snap-start sama).
export default function BrideSection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);

  return (
    <section className="relative z-10 h-[100lvh] overflow-hidden flex items-end text-groove-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.bridePhoto || DEFAULT_PHOTO}
        alt={data.brideFullName}
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent -z-10" />

      <div className="relative px-6 md:px-14 pb-24 md:pb-28 max-w-md">
        <p className="font-groove-label text-xs uppercase tracking-[0.35em] text-groove-bg/70 mb-4">
          {t.theBride}
        </p>
        <h2 className="font-reverie-display text-4xl md:text-5xl mb-6" style={{ fontWeight: 400 }}>
          {data.brideFullName}
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <p className="font-reverie-display italic text-lg shrink-0">{t.daughterOf}</p>
          <div className="h-px flex-1 bg-groove-bg/40" />
        </div>
        <p className="font-groove-body text-sm text-groove-bg/85 leading-relaxed mb-8">
          {data.brideParents}
        </p>
        {data.brideInstagram && (
          <a
            href={`https://instagram.com/${data.brideInstagram.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-groove-label text-xs uppercase tracking-wide text-groove-bg/90"
          >
            <InstagramIcon className="h-4 w-4" /> {data.brideNickname}
          </a>
        )}
      </div>
    </section>
  );
}
