"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InvitationDetailNav({ id, pendingChangeRequests }: { id: string; pendingChangeRequests: number }) {
  const pathname = usePathname();
  const base = `/admin/invitations/${id}`;
  const tabs = [
    { href: base, label: "Ringkasan" },
    { href: `${base}/edit`, label: "Edit" },
    { href: `${base}/guests`, label: "Tamu" },
    { href: `${base}/rsvp`, label: "RSVP & Ucapan" },
    { href: `${base}/change-requests`, label: "Perubahan Acara", badge: pendingChangeRequests },
  ];

  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const active = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
              active ? "border-lume-ink text-lume-ink font-medium" : "border-transparent text-gray-500 hover:text-lume-ink"
            }`}
          >
            {tab.label}
            {!!tab.badge && (
              <span className="inline-flex items-center justify-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-amber-500 text-white text-[10px]">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
