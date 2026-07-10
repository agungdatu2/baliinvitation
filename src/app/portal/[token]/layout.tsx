import type { Metadata } from "next";
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
        <div>
          <p className="text-lume-gold text-xs uppercase tracking-widest mb-3">BaliInvitation Portal</p>
          <p className="text-lume-ink">{ACCESS_MESSAGE[access] ?? ACCESS_MESSAGE.invalid}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lume-bg">
      <header className="border-b border-lume-line bg-white/60">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <p className="text-xs uppercase tracking-widest text-lume-gold">Portal Client</p>
          <h1 className="font-serif text-lg text-lume-ink">
            {invitation.groomNickname} & {invitation.brideNickname}
          </h1>
        </div>
      </header>
      <PortalNav token={params.token} />
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-4">{children}</div>
    </div>
  );
}
