"use client";

import { useState } from "react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/grand-opening";
import FixedBackground from "./FixedBackground";
import LoadingReveal from "./LoadingReveal";
import GateScreen from "./GateScreen";
import EventDetails from "./EventDetails";
import RSVPForm from "./RSVPForm";
import ClosingFooter from "./ClosingFooter";
import Reveal from "./Reveal";

const GOLD_GRADIENT = "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 45%, #8a6d2f 100%)";

// Orchestrator tema "Grand Opening" — dipakai untuk acara non-wedding (melaspas,
// grand opening bisnis, dll). Alurnya: loading branded (gaya PageLoader landing,
// bukan progress bar Lume) -> gate nama tamu -> konten (hero, detail acara +
// countdown + maps, ucapan penutup, RSVP + buku tamu).
export default function GrandOpeningTemplate({ data, guestName, guestId }: TemplateProps) {
  const [loading, setLoading] = useState(data.hasIntro);
  const [opened, setOpened] = useState(false);
  const t = getDict(data.language);

  return (
    <main className="text-groove-bg font-groove-body min-h-screen">
      <FixedBackground
        type={data.backgroundType}
        videoSrc={data.heroVideoUrl}
        imageSrc={data.backgroundImage}
        slideshowImages={data.backgroundSlideshowImages}
      />

      {loading && <LoadingReveal onComplete={() => setLoading(false)} />}

      {!loading && !opened && (
        <GateScreen
          eventTitle={data.eventTitle}
          hostName={data.hostName}
          hostLogo={data.hostLogo}
          guestName={guestName}
          lang={data.language}
          onOpen={() => setOpened(true)}
        />
      )}

      {opened && (
        <div className="animate-fadeIn groove-page-blur">
          {/* Hero — branding besar, bukan duplikat countdown (countdown lengkap
              ada di EventDetails di bawah) */}
          <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
            {data.hostLogo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.hostLogo} alt={data.hostName ?? ""} className="w-20 h-20 object-contain mb-6" />
            )}
            <p className="font-groove-label uppercase tracking-[0.3em] text-xs text-groove-primary-light mb-4">
              {t.invitationLabel}
            </p>
            <h1
              className="font-groove-display uppercase text-5xl sm:text-6xl md:text-7xl leading-none mb-4"
              style={{
                fontWeight: 700,
                backgroundImage: GOLD_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              {data.eventTitle}
            </h1>
            {data.hostName && (
              <p className="font-groove-display text-xl sm:text-2xl text-groove-bg" style={{ fontWeight: 500 }}>
                {data.hostName}
              </p>
            )}
          </section>

          <Reveal>
            <EventDetails events={data.events} title={data.hostName ?? data.eventTitle ?? ""} lang={data.language} />
          </Reveal>

          {data.greeting && (
            <Reveal>
              <section className="text-center py-16 px-6">
                <p className="font-groove-body text-sm sm:text-base text-groove-bg/80 max-w-xl mx-auto leading-relaxed">
                  {data.greeting}
                </p>
              </section>
            </Reveal>
          )}

          <Reveal>
            <RSVPForm invitationId={data.id ?? data.slug} guestName={guestName} guestId={guestId} lang={data.language} />
          </Reveal>

          <ClosingFooter data={data} />
        </div>
      )}
    </main>
  );
}
