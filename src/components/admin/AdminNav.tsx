"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Palette, Wallet, Package, LogOut } from "lucide-react";

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
        <nav className="p-3 space-y-1 flex-1">
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
        <div className="p-3 border-t border-lume-line">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-lume-ink transition w-full"
          >
            <LogOut size={17} strokeWidth={1.75} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Top bar + horizontal tabs (mobile) */}
      <div className="md:hidden border-b border-lume-line bg-white">
        <div className="px-4 py-4 flex items-center justify-between">
          <p className="font-serif text-lg text-lume-ink">BaliInvitation — Admin</p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            aria-label="Keluar"
            className="text-gray-400 hover:text-lume-ink transition"
          >
            <LogOut size={18} strokeWidth={1.75} />
          </button>
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
