import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CommercialNavbar } from "../navbar";
import { CarteVisiteManager } from "./carte-visite-manager";

export default function CarteVisitePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#07070a] via-[#0a0f14] to-[#07070a] text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.05),transparent_40%)]" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07070a]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link href="/commercial" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-indigo-500/20 blur-sm" />
              <Image
                src="/logo.jpeg"
                alt="Kpandji"
                width={40}
                height={40}
                className="relative h-8 w-8 rounded-full ring-1 ring-indigo-500/30 md:h-10 md:w-10"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-white md:text-base">
                Espace Commercial
              </span>
              <span className="text-[0.6rem] text-indigo-400/50 md:text-xs">
                Kpandji Automobiles · SIREXE 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-indigo-300/80 md:inline-block md:text-xs">
              Commercial
            </span>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 md:h-10 md:w-10",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* ── Navbar ── */}
      <CommercialNavbar />

      {/* ── Page content ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="mb-8 md:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5">
            <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-[0.6rem] font-bold uppercase tracking-wider text-indigo-300/80 md:text-xs">
              Carte de Visite
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            Carte de Visite
          </h1>
          <p className="mt-2 text-sm text-white/40 md:text-base">
            Scannez et gérez les cartes de visite de vos contacts
          </p>
        </div>

        {/* Card manager (client component with button + modal + grid) */}
        <CarteVisiteManager />
      </section>
    </main>
  );
}
