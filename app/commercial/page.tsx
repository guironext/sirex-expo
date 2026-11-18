import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { CommercialNavbar } from "./navbar";

export default function CommercialPage() {
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

      {/* ── Dashboard content ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            Bienvenue
          </h1>
          <p className="mt-2 text-sm text-white/40 md:text-base">
            Votre espace commercial pour le SIREXE 2026
          </p>
        </div>

        {/* Quick access cards */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-white md:text-xl">Ressources</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            <Link href="/voitures" className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-amber-500/20 hover:bg-amber-500/[0.03]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Catalogue Voitures</p>
                  <p className="text-[0.65rem] text-white/40">Voir le catalogue</p>
                </div>
              </div>
            </Link>

            <Link href="/alternateur-tpo" className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-cyan-500/20 hover:bg-cyan-500/[0.03]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <svg className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Alternateur TPO</p>
                  <p className="text-[0.65rem] text-white/40">Voir la brochure</p>
                </div>
              </div>
            </Link>

            <a
              href="/catalogue.pdf"
              download
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-indigo-500/20 hover:bg-indigo-500/[0.03]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Télécharger Catalogue</p>
                  <p className="text-[0.65rem] text-white/40">PDF</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/[0.03] p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
              <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Salon International des Mines, du Pétrole, du Gaz et de l'Énergie</p>
              <p className="mt-1 text-xs text-white/40">18 - 22 Novembre 2026 · Abidjan, Côte d'Ivoire</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
