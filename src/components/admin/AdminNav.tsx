"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Undangan Berjalan" },
  { href: "/admin/themes", label: "Tema" },
  { href: "/admin/income", label: "Income" },
  { href: "/admin/packages", label: "Paket" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 mb-6">
      <div className="max-w-6xl mx-auto px-6 flex gap-1">
        {TABS.map((tab) => {
          const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 text-sm border-b-2 transition ${
                active
                  ? "border-lume-ink text-lume-ink font-medium"
                  : "border-transparent text-gray-500 hover:text-lume-ink"
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
