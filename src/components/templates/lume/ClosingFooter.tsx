import { InvitationData } from "@/types/invitation";

export default function ClosingFooter({ data }: { data: InvitationData }) {
  return (
    <footer className="text-center py-16 px-6 bg-lume-ink text-white">
      {data.quote && <p className="italic text-sm max-w-md mx-auto mb-8 opacity-80">&ldquo;{data.quote}&rdquo;</p>}
      <h2 className="font-script text-3xl mb-1">{data.groomNickname}</h2>
      <p className="text-lume-gold text-sm">&bull;</p>
      <h2 className="font-script text-3xl mb-6">{data.brideNickname}</h2>
      <p className="text-xs opacity-60">made with love by BaliInvitation</p>
    </footer>
  );
}
