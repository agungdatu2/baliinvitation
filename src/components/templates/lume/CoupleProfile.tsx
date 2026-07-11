import { InvitationData } from "@/types/invitation";
import PlaceholderPhoto from "./PlaceholderPhoto";

export default function CoupleProfile({ data }: { data: InvitationData }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-20 max-w-3xl mx-auto">
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
    <div className="text-center groove-glass rounded-2xl p-6">
      <PlaceholderPhoto label="Portrait placeholder" className="aspect-[4/5] rounded-sm mb-5" />
      <p className="text-xs uppercase tracking-widest text-groove-moss mb-2">{label}</p>
      <h3 className="font-groove-display text-2xl mb-2" style={{ fontWeight: 600 }}>
        {fullName}
      </h3>
      <p className="text-sm text-groove-ink/70">{parents}</p>
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace("@", "")}`}
          target="_blank"
          className="text-xs text-groove-clay mt-3 inline-block border-b border-groove-clay"
        >
          @{instagram.replace("@", "")}
        </a>
      )}
    </div>
  );
}
