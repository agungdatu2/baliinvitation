"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PortalNav({ token }: { token: string }) {
  const pathname = usePathname();
  const base = `/portal/${token}`;
  const tabs = [
    { href: base, label: "Ringkasan" },
    { href: `${base}/guests`, label: "Tamu" },
    { href: `${base}/rsvp`, label: "RSVP" },
    { href: `${base}/events`, label: "Acara" },
  ];

  return (
    <nav className="sticky top-0 z-10 bg-lume-bg/95 backdrop-blur border-b border-lume-line overflow-x-auto">
      <div className="max-w-2xl mx-auto px-4 flex gap-1">
        {tabs.map((tab) => {
          const active = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                active ? "border-lume-ink text-lume-ink font-medium" : "border-transparent text-gray-500"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
