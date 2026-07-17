import { Globe } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { normalizeWaNumber } from "@/lib/utils/whatsapp";
import { getDict } from "@/lib/i18n/lume";

// Kontak resmi BaliInvitation (bukan data client) — sama untuk semua undangan,
// ditampilkan di footer sebagai kredit "Created By".
const CREATOR = {
  whatsappNumber: "085190090902",
  whatsappLabel: "+62 851-9009-0902",
  instagramHandle: "baliinvitation",
  website: "baliinvitation.com",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.11 0 4.1.83 5.59 2.32a7.9 7.9 0 0 1 2.32 5.92c0 4.53-3.69 8.22-8.22 8.22a8.2 8.2 0 0 1-4.17-1.14l-.29-.17-3.11.82.83-3.03-.19-.31a8.16 8.16 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.22-8.22Zm-4.5 4.68c-.17 0-.44.06-.68.32-.23.26-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.79 2.86 4.44 3.9 2.2.86 2.65.69 3.13.65.48-.04 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.17-.5-.3-.26-.13-1.55-.77-1.79-.85-.24-.09-.42-.13-.6.13-.17.26-.68.85-.83 1.02-.15.17-.3.19-.57.06-.26-.13-1.09-.4-2.07-1.28-.77-.68-1.28-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.47.13-.15.17-.26.26-.44.09-.17.04-.32-.02-.45-.06-.13-.6-1.44-.82-1.98-.22-.52-.44-.45-.6-.46l-.51-.01Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ClosingFooter({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  return (
    <footer className="groove-overlay-dark text-groove-bg text-center py-24 px-6 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-groove-display text-4xl leading-tight mb-6" style={{ fontWeight: 500 }}>
            {t.thankYou}
            <br />
            {t.forYourAttendance}
          </h2>
          <p className="font-groove-body text-sm text-groove-bg/80 mb-6">{t.honorText}</p>
          <h3 className="font-groove-display uppercase text-lg tracking-widest" style={{ fontWeight: 500 }}>
            {data.groomNickname} &amp; {data.brideNickname}
          </h3>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4">
        <p className="font-groove-label text-[10px] opacity-45 tracking-widest uppercase">Created By</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <a
            href={`https://wa.me/${normalizeWaNumber(CREATOR.whatsappNumber)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-groove-bg/80 hover:text-groove-bg transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-groove-bg/40 flex items-center justify-center shrink-0">
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </span>
            <span className="font-groove-label text-xs tracking-wide">{CREATOR.whatsappLabel}</span>
          </a>
          <a
            href={`https://instagram.com/${CREATOR.instagramHandle}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-groove-bg/80 hover:text-groove-bg transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-groove-bg/40 flex items-center justify-center shrink-0">
              <InstagramIcon className="w-3.5 h-3.5" />
            </span>
            <span className="font-groove-label text-xs tracking-wide uppercase">{CREATOR.instagramHandle}</span>
          </a>
          <a
            href={`https://${CREATOR.website}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-groove-bg/80 hover:text-groove-bg transition-colors"
          >
            <span className="w-7 h-7 rounded-full border border-groove-bg/40 flex items-center justify-center shrink-0">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.75} />
            </span>
            <span className="font-groove-label text-xs tracking-wide uppercase">{CREATOR.website}</span>
          </a>
        </div>
        <p className="font-groove-label text-[10px] opacity-45 tracking-widest uppercase">
          © All rights reserved by BaliInvitation
        </p>
      </div>
    </footer>
  );
}
