import { InvitationData } from "@/types/invitation";

export default function LoveStory({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;
  return (
    <section className="px-6 py-14 max-w-2xl mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-lume-gold mb-2">Our Love Story</p>
      <h2 className="font-script text-3xl mb-10">
        {data.groomNickname} &amp; {data.brideNickname}
      </h2>
      <div className="space-y-8 text-left">
        {data.loveStory.map((item, i) => (
          <div key={i} className="border-l-2 border-lume-gold pl-4">
            <h4 className="font-medium mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.story}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
