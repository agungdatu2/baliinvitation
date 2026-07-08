import { InvitationData } from "@/types/invitation";

export default function CoupleProfile({ data }: { data: InvitationData }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-12 max-w-3xl mx-auto">
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
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest text-lume-gold mb-2">{label}</p>
      <h3 className="font-serif text-2xl mb-2">{fullName}</h3>
      <p className="text-sm text-gray-600">{parents}</p>
      {instagram && (
        <a href={`https://instagram.com/${instagram.replace("@", "")}`} target="_blank" className="text-xs text-lume-gold mt-2 inline-block">
          @{instagram.replace("@", "")}
        </a>
      )}
    </div>
  );
}
