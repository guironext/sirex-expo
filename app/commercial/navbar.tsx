"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Accueil",
    href: "/commercial",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
  },
  {
    label: "Prospect",
    href: "/commercial/prospect",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    label: "Carte de Visite",
    href: "/commercial/carte-visite",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    ),
  },
];

export function CommercialNavbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[57px] z-40 border-b border-white/[0.06] bg-[#07070a]/90 backdrop-blur-2xl md:top-[65px]">
      <div className="mx-auto max-w-6xl px-2 md:px-8">
        <div className="flex items-center gap-1 overflow-x-auto md:gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/commercial"
                ? pathname === "/commercial"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex flex-shrink-0 items-center gap-2 px-3 py-3 text-xs font-bold transition-all md:px-4 md:py-3.5 md:text-sm ${
                  isActive
                    ? "text-indigo-300"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <svg
                  className={`h-4 w-4 transition-colors md:h-4.5 md:w-4.5 ${
                    isActive ? "text-indigo-400" : "text-white/30 group-hover:text-white/50"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
                <span className="whitespace-nowrap">{item.label}</span>
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? "w-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                      : "w-0 bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
