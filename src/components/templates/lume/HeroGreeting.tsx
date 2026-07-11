import { InvitationData } from "@/types/invitation";
import Reveal from "./Reveal";

export default function HeroGreeting({ data }: { data: InvitationData }) {
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const venue = data.events?.[0]?.location;

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 text-groove-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-groove-stone/10 via-transparent to-groove-stone/60" />

      <div className="relative z-10">
        <Reveal delay={0}>
          <p className="uppercase tracking-[0.3em] text-xs text-groove-clay-light mb-3">{eventDateLabel}</p>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="font-groove-display italic text-[clamp(2.6rem,9vw,5rem)]" style={{ fontWeight: 500 }}>
            {data.groomNickname} <span className="not-italic text-groove-clay-light">&amp;</span> {data.brideNickname}
          </h1>
        </Reveal>
        {venue && (
          <Reveal delay={300}>
            <p className="mt-3 text-sm text-groove-bg/70">{venue}</p>
          </Reveal>
        )}
        {data.greeting && (
          <Reveal delay={450}>
            <p className="mt-8 text-sm leading-relaxed text-groove-bg/80 whitespace-pre-line max-w-md mx-auto">{data.greeting}</p>
          </Reveal>
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 w-px h-8 bg-groove-bg/40 overflow-hidden"
      >
        <div className="absolute -top-8 left-0 w-px h-8 bg-groove-bg animate-[groove-scroll-cue_2.2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
