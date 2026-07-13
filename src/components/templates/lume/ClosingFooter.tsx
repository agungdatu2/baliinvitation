import { InvitationData } from "@/types/invitation";

export default function ClosingFooter({ data }: { data: InvitationData }) {
  return (
    <footer className="text-center py-10 px-6">
      <div className="groove-glass-dark text-groove-bg rounded-2xl py-16 px-6 max-w-md mx-auto">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-primary-light mb-4">Terima Kasih</p>
        <p className="font-groove-body italic text-base max-w-md mx-auto mb-9 leading-relaxed text-groove-bg/85">
          Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
        </p>
        <h2 className="font-groove-display italic text-3xl" style={{ fontWeight: 400 }}>
          {data.groomNickname} <span className="not-italic text-groove-primary-light">&amp;</span> {data.brideNickname}
        </h2>
        <p className="font-groove-label text-[10px] opacity-45 mt-8 tracking-widest uppercase">made with love by BaliInvitation</p>
      </div>
    </footer>
  );
}
