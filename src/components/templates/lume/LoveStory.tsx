import { InvitationData } from "@/types/invitation";

export default function LoveStory({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;
  return (
    <section className="groove-overlay text-groove-bg py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-groove-label uppercase tracking-widest text-xs text-groove-bg/70 mb-2">Perjalanan Kami</p>
          <h2 className="font-groove-display italic text-3xl" style={{ fontWeight: 400 }}>
            {data.groomNickname} &amp; {data.brideNickname}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-groove-line hidden md:block" aria-hidden="true" />
          <div className="space-y-10 md:space-y-14">
            {data.loveStory.map((item, i) => {
              const onRight = i % 2 === 1;
              return (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className={`md:w-1/2 ${onRight ? "md:order-2 md:text-left" : "md:text-right"}`}>
                    <h4 className="font-groove-display text-xl mb-2" style={{ fontWeight: 600 }}>
                      {item.title}
                    </h4>
                    <p className="font-groove-body text-sm text-groove-bg/80 leading-relaxed whitespace-pre-line">{item.story}</p>
                  </div>
                  <div className="hidden md:flex w-8 justify-center relative shrink-0">
                    <div className="w-3 h-3 bg-groove-primary rounded-full mt-1.5 ring-8 ring-groove-bg/75" />
                  </div>
                  <div className={`md:w-1/2 ${onRight ? "md:order-1" : ""}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
