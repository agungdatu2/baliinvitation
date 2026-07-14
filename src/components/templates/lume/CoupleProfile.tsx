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
          imageSeed="lume-groom"
        />
        <ProfileCard
          label="The Bride"
          childLabel="Putri dari"
          fullName={data.brideFullName}
          parents={data.brideParents}
          instagram={data.brideInstagram}
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
  imageSeed,
  reverse = false,
}: {
  label: string;
  childLabel: string;
  fullName: string;
  parents: string;
  instagram?: string;
  imageSeed: string;
  reverse?: boolean;
}) {
  return (
    <div className={`group flex flex-col md:flex-row items-center gap-8 md:gap-14 ${reverse ? "md:flex-row-reverse" : ""}`}>
      <div className="relative w-56 md:w-64 shrink-0">
        <span
          aria-hidden="true"
          className={`absolute -top-3 w-10 h-10 border-t border-groove-primary-light/70 ${
            reverse ? "-right-3 border-r" : "-left-3 border-l"
          }`}
        />
        <span
          aria-hidden="true"
          className={`absolute -bottom-3 w-10 h-10 border-b border-groove-primary-light/70 ${
            reverse ? "-left-3 border-l" : "-right-3 border-r"
          }`}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${imageSeed}/480/600`}
          alt={fullName}
          className="w-full aspect-[4/5] object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </div>

      <div className={`text-center md:text-left ${reverse ? "md:text-right" : ""}`}>
        <p className="font-groove-label text-xs uppercase tracking-[0.3em] text-groove-primary-light mb-3">{label}</p>
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
