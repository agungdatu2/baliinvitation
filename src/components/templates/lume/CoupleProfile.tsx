"use client";

import { useEffect, useRef, useState } from "react";
import { AtSign } from "lucide-react";
import { InvitationData } from "@/types/invitation";

export default function CoupleProfile({ data }: { data: InvitationData }) {
  return (
    <section className="groove-overlay text-groove-bg py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-20 md:space-y-28">
        <ProfileCard
          label="The Groom"
          childLabel="Putra dari"
          fullName={data.groomFullName}
          parents={data.groomParents}
          instagram={data.groomInstagram}
          photo={data.groomPhoto}
          imageSeed="lume-groom"
        />
        <ProfileCard
          label="The Bride"
          childLabel="Putri dari"
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
  fullName,
  parents,
  instagram,
  photo,
  imageSeed,
  reverse = false,
}: {
  label: string;
  childLabel: string;
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
            <AtSign className="h-3.5 w-3.5" /> {instagram.replace("@", "")}
          </a>
        )}
      </div>
    </div>
  );
}
