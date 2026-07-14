import { AtSign } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import PlaceholderPhoto from "./PlaceholderPhoto";

export default function CoupleProfile({ data }: { data: InvitationData }) {
  return (
    <section className="groove-overlay text-groove-bg py-20 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
        <ProfileCard
          label="Mempelai Pria"
          fullName={data.groomFullName}
          parents={data.groomParents}
          instagram={data.groomInstagram}
        />
        <ProfileCard
          label="Mempelai Wanita"
          fullName={data.brideFullName}
          parents={data.brideParents}
          instagram={data.brideInstagram}
        />
      </div>
    </section>
  );
}

function ProfileCard({
  label,
  fullName,
  parents,
  instagram,
}: {
  label: string;
  fullName: string;
  parents: string;
  instagram?: string;
}) {
  return (
    <div className="text-center group">
      <PlaceholderPhoto
        label="Portrait placeholder"
        className="aspect-[3/4] rounded-sm mb-5 grayscale group-hover:grayscale-0 transition-all duration-700"
      />
      <p className="font-groove-label text-xs uppercase tracking-widest text-groove-primary mb-2">{label}</p>
      <h3 className="font-groove-display text-2xl mb-2" style={{ fontWeight: 600 }}>
        {fullName}
      </h3>
      <p className="font-groove-body text-sm text-groove-bg/75">{parents}</p>
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace("@", "")}`}
          target="_blank"
          className="font-groove-label inline-flex items-center gap-1.5 text-xs text-groove-bg/70 mt-3"
        >
          <AtSign className="h-3.5 w-3.5" /> {instagram.replace("@", "")}
        </a>
      )}
    </div>
  );
}
