import { InvitationData } from "@/types/invitation";
import Reveal from "./Reveal";

export default function HeroGreeting({ data }: { data: InvitationData }) {
  return (
    <section className="text-center py-16 px-6 max-w-lg mx-auto">
      <Reveal delay={0}>
        <p className="uppercase tracking-[0.3em] text-xs text-lume-gold mb-3">The Wedding Of</p>
      </Reveal>
      <Reveal delay={150}>
        <h1 className="font-script text-4xl mb-1">{data.groomNickname}</h1>
        <p className="text-lume-gold">&bull;</p>
        <h1 className="font-script text-4xl mb-4">{data.brideNickname}</h1>
      </Reveal>
      <Reveal delay={300}>
        <p className="text-sm text-gray-600 mb-8">
          {new Date(data.eventDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </Reveal>
      {data.greeting && (
        <Reveal delay={450}>
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{data.greeting}</p>
        </Reveal>
      )}
    </section>
  );
}
