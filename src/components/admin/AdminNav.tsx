"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Palette, Wallet, Package } from "lucide-react";

const TABS = [
  { href: "/admin", label: "Undangan Berjalan", icon: LayoutDashboard },
  { href: "/admin/themes", label: "Tema", icon: Palette },
  { href: "/admin/income", label: "Income", icon: Wallet },
  { href: "/admin/packages", label: "Paket", icon: Package },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-lume-line bg-white min-h-screen">
        <div className="px-6 py-5 border-b border-lume-line">
          <p className="font-serif text-lg text-lume-ink">BaliInvitation</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin</p>
        </div>
        <nav className="p-3 space-y-1">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-lume-gold/10 text-lume-ink font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-lume-ink"
                }`}
              >
                <Icon size={17} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Top bar + horizontal tabs (mobile) */}
      <div className="md:hidden border-b border-lume-line bg-white">
        <div className="px-4 py-4">
          <p className="font-serif text-lg text-lume-ink">BaliInvitation — Admin</p>
        </div>
        <nav className="flex gap-1 px-4 overflow-x-auto">
          {TABS.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                  active
                    ? "border-lume-ink text-lume-ink font-medium"
                    : "border-transparent text-gray-500 hover:text-lume-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
