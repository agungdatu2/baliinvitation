import { InvitationData } from "@/types/invitation";

export default function LoveStory({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;
  return (
    <section className="groove-overlay text-groove-bg py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
        <h2 className="font-groove-display text-3xl md:text-4xl leading-tight" style={{ fontWeight: 500 }}>
          A Journey In Love: The {data.groomNickname} and {data.brideNickname} Connection
        </h2>

        <div className="space-y-6">
          {data.loveStory.map((item, i) => (
            <div key={i}>
              <h4 className="font-groove-body text-sm font-semibold mb-1">{item.title}</h4>
              <p className="font-groove-body text-sm text-groove-bg/80 leading-relaxed whitespace-pre-line">{item.story}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
