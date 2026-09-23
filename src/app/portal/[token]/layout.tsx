import type { Metadata } from "next";
import Image from "next/image";
import { resolvePortalByToken } from "@/lib/portal/resolve-portal";
import PortalNav from "@/components/portal/PortalNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const ACCESS_MESSAGE: Record<string, string> = {
  invalid: "Link portal tidak valid. Mohon cek kembali link yang diberikan admin.",
  disabled: "Portal untuk undangan ini sedang dinonaktifkan sementara oleh admin.",
  expired: "Link portal ini sudah tidak berlaku (acara sudah lewat lebih dari 30 hari).",
};

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { token: string };
}) {
  const { invitation, access } = await resolvePortalByToken(params.token);

  if (access !== "ok" || !invitation) {
    return (
      <div className="min-h-screen bg-lume-bg flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <Image
            src="/brand/logo.webp"
            alt="BaliInvitation"
            width={220}
            height={65}
            className="h-8 w-auto mx-auto mb-6"
          />
          <p className="text-lume-gold text-xs uppercase tracking-widest mb-3">Portal Client</p>
          <p className="text-lume-ink">{ACCESS_MESSAGE[access] ?? ACCESS_MESSAGE.invalid}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lume-bg">
      <header className="border-b border-lume-line bg-white">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
          <Image
            src="/brand/logo.webp"
            alt="BaliInvitation"
            width={220}
            height={65}
            className="h-6 w-auto shrink-0"
          />
          <div className="h-8 w-px bg-lume-line shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-lume-gold">Portal Client</p>
            <h1 className="font-serif text-lg text-lume-ink truncate">
              {invitation.hostName || `${invitation.groomNickname} & ${invitation.brideNickname}`}
            </h1>
          </div>
        </div>
      </header>
      <PortalNav token={params.token} />
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-5">{children}</div>
    </div>
  );
}
