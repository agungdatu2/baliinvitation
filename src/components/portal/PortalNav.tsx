"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, MessageSquareText, CalendarClock } from "lucide-react";

export default function PortalNav({ token }: { token: string }) {
  const pathname = usePathname();
  const base = `/portal/${token}`;
  const tabs = [
    { href: base, label: "Ringkasan", icon: LayoutDashboard },
    { href: `${base}/guests`, label: "Tamu", icon: Users },
    { href: `${base}/rsvp`, label: "RSVP", icon: MessageSquareText },
    { href: `${base}/events`, label: "Acara", icon: CalendarClock },
  ];

  return (
    <nav className="sticky top-0 z-10 bg-lume-bg/95 backdrop-blur border-b border-lume-line overflow-x-auto no-scrollbar">
      <div className="max-w-2xl mx-auto px-4 flex gap-1 py-2">
        {tabs.map((tab) => {
          const active = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                active ? "bg-lume-ink text-white font-medium" : "text-gray-500 hover:bg-white hover:text-lume-ink"
              }`}
            >
              <Icon size={15} strokeWidth={1.75} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
