"use client";

import { useEffect, useRef, useState } from "react";
import { InvitationData } from "@/types/invitation";

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

export default function CoupleProfile({ data }: { data: InvitationData }) {
  return (
    <section className="groove-overlay text-groove-bg py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-20 md:space-y-28">
        <ProfileCard
          label="The Groom"
          childLabel="Putra dari"
          nickname={data.groomNickname}
          fullName={data.groomFullName}
          parents={data.groomParents}
          instagram={data.groomInstagram}
          photo={data.groomPhoto}
          imageSeed="lume-groom"
        />
        <ProfileCard
          label="The Bride"
          childLabel="Putri dari"
          nickname={data.brideNickname}
          fullName={data.brideFullName}
          parents={data.brideParents}
          instagram={data.brideInstagram}
          photo={data.bridePhoto}
          imageSeed="lume-bride"
          reverse
        />
      </div>
    </section>
  );
}

function ProfileCard({
  label,
  childLabel,
  nickname,
  fullName,
  parents,
  instagram,
  photo,
  imageSeed,
  reverse = false,
}: {
  label: string;
  childLabel: string;
  nickname: string;
  fullName: string;
  parents: string;
  instagram?: string;
  photo?: string;
  imageSeed: string;
  reverse?: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    // Foto masuk warna tiap kali section-nya masuk viewport (scroll turun ATAU naik
    // balik lagi), bukan cuma sekali atau lewat hover.
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-14 ${reverse ? "md:flex-row-reverse" : ""}`}>
      <div className="relative w-72 md:w-[26rem] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={photo || `https://picsum.photos/seed/${imageSeed}/480/600`}
          alt={fullName}
          className={`w-full aspect-[4/5] object-cover rounded-sm transition-all duration-1000 ${
            inView ? "grayscale-0" : "grayscale"
          }`}
        />
      </div>

      <div className={`text-center md:text-left ${reverse ? "md:text-right" : ""}`}>
        <p className="font-groove-label text-xs uppercase tracking-[0.3em] text-groove-bg/60 mb-3">{label}</p>
        <h3 className="font-groove-display italic text-4xl md:text-5xl mb-5" style={{ fontWeight: 500 }}>
          {fullName}
        </h3>
        <p className="font-groove-label text-xs uppercase tracking-widest text-groove-bg/60 mb-1.5">{childLabel}</p>
        <p className="font-groove-body text-sm text-groove-bg/80 max-w-xs mx-auto md:mx-0">{parents}</p>
        {instagram && (
          <a
            href={`https://instagram.com/${instagram.replace("@", "")}`}
            target="_blank"
            className={`font-groove-label mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-wide bg-groove-stone/60 border border-groove-line-dark rounded-full px-5 py-2.5 hover:bg-groove-stone/80 transition-colors ${
              reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <InstagramIcon className="h-3.5 w-3.5" /> {nickname}
          </a>
        )}
      </div>
    </div>
  );
}
