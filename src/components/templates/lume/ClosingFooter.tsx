import { InvitationData } from "@/types/invitation";

export default function ClosingFooter({ data }: { data: InvitationData }) {
  return (
    <footer className="groove-overlay-dark text-groove-bg text-center py-20 px-6">
      <div className="max-w-5xl mx-auto">
      <div className="max-w-md mx-auto">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-bg/60 mb-4">Terima Kasih</p>
        <p className="font-groove-body italic text-base max-w-md mx-auto mb-9 leading-relaxed text-groove-bg/85">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
        </p>
        <h2 className="font-groove-display italic text-3xl" style={{ fontWeight: 400 }}>
          {data.groomNickname} <span className="not-italic text-groove-bg/60">&amp;</span> {data.brideNickname}
        </h2>
        <p className="font-groove-label text-[10px] opacity-45 mt-8 tracking-widest uppercase">made with love by BaliInvitation</p>
      </div>
      </div>
    </footer>
  );
}
