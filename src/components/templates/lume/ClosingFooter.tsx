import { InvitationData } from "@/types/invitation";

export default function ClosingFooter({ data }: { data: InvitationData }) {
  return (
    <footer className="text-center py-20 px-6 bg-groove-stone text-groove-bg">
      {data.quote && (
        <p className="font-groove-display italic text-lg max-w-md mx-auto mb-9 leading-relaxed text-groove-bg/85">
          &ldquo;{data.quote}&rdquo;
        </p>
      )}
      <h2 className="font-groove-display italic text-3xl" style={{ fontWeight: 500 }}>
        {data.groomNickname} <span className="not-italic text-groove-clay-light">&amp;</span> {data.brideNickname}
      </h2>
      <p className="text-xs opacity-45 mt-8 tracking-wide">made with love by BaliInvitation</p>
    </footer>
  );
}
