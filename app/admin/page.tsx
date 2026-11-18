import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AdminPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#07070a] via-[#0a0f14] to-[#07070a] text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.05),transparent_40%)]" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07070a]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-cyan-500/20 blur-sm" />
              <Image
                src="/logo.jpeg"
                alt="Kpandji"
                width={40}
                height={40}
                className="relative h-8 w-8 rounded-full ring-1 ring-cyan-500/30 md:h-10 md:w-10"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-white md:text-base">
                Admin Panel
              </span>
              <span className="text-[0.6rem] text-cyan-400/50 md:text-xs">
                Kpandji Automobiles · SIREXE 2026
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-cyan-300/80 md:inline-block md:text-xs">
              Administrateur
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

      {/* ── Dashboard content ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-white/40 md:text-base">
            Gérez votre présence au SIREXE 2026
          </p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:gap-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                </svg>
              </div>
              <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Catalogue</span>
            </div>
            <p className="text-2xl font-black text-white md:text-3xl">14</p>
            <p className="text-[0.6rem] text-white/30 md:text-xs">Pages de voitures</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Brochure</span>
            </div>
            <p className="text-2xl font-black text-white md:text-3xl">13</p>
            <p className="text-[0.6rem] text-white/30 md:text-xs">Pages alternateur</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Événement</span>
            </div>
            <p className="text-2xl font-black text-white md:text-3xl">SIREXE</p>
            <p className="text-[0.6rem] text-white/30 md:text-xs">18-22 Nov 2026</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Statut</span>
            </div>
            <p className="text-2xl font-black text-white md:text-3xl">En ligne</p>
            <p className="text-[0.6rem] text-white/30 md:text-xs">Site actif</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-white md:text-xl">Accès rapide</h2>
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

            <Link href="/" className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Page d'accueil</p>
                  <p className="text-[0.65rem] text-white/40">Voir le site</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
