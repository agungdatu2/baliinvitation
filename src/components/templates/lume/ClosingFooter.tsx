import { InvitationData } from "@/types/invitation";

export default function ClosingFooter({ data }: { data: InvitationData }) {
  return (
    <footer className="groove-overlay-dark text-groove-bg text-center py-24 px-6 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-groove-display text-4xl md:text-5xl leading-tight mb-6" style={{ fontWeight: 500 }}>
            Thank You
            <br />
            For Your Attendance And Support
          </h2>
          <p className="font-groove-body text-sm md:text-base text-groove-bg/80 mb-6">
            It is a pleasure and honor for us, if you are willing to attend and give us your blessing.
          </p>
          <h3 className="font-groove-display uppercase text-lg tracking-widest" style={{ fontWeight: 500 }}>
            {data.groomNickname} &amp; {data.brideNickname}
          </h3>
        </div>
      </div>

      <p className="font-groove-label text-[10px] opacity-45 mt-16 tracking-widest uppercase">
        made with love by BaliInvitation
      </p>
    </footer>
  );
}
