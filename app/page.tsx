import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0f0a14] to-[#0a0a0f] text-foreground">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(245,158,11,0.15),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(168,85,247,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_80%,rgba(234,179,8,0.06),transparent_40%)]" />

      {/* Decorative grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Top bar: side logos ── */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 md:p-6 lg:p-8">
        {/* Left: SIREXE 2026 banner */}
        <div className="animate-slide-left w-32 opacity-95 drop-shadow-xl sm:w-40 md:w-48 lg:w-60">
          <Image
            src="/logo_fr.webp"
            alt="SIREXE 2026 — Salon International des Mines, du Pétrole, du Gaz et de l'Énergie"
            width={240}
            height={65}
            className="h-auto w-full rounded-lg bg-white/95 object-contain p-1 shadow-2xl ring-1 ring-white/10"
            priority
          />
        </div>

        {/* Right: Kpandji logo */}
        <div className="animate-slide-right flex flex-col items-center gap-1">
          <Image
            src="/logo.jpeg"
            alt="Kpandji Automobiles"
            width={96}
            height={96}
            className="h-12 w-12 rounded-full shadow-2xl ring-2 ring-amber-500/40 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20"
            priority
          />
        </div>
      </header>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-24 md:pt-32">
        {/* Title */}
        <h1
          className="animate-title mb-6 text-center text-3xl font-black leading-tight tracking-tight sm:text-4xl md:mb-8 md:text-5xl lg:mb-12 lg:text-7xl"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #fbbf24 0%, #ffffff 35%, #fde68a 55%, #ffffff 75%, #fbbf24 100%)",
            backgroundSize: "200% auto",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "title-reveal 1s cubic-bezier(0.22,1,0.36,1) forwards, shimmer 4s linear 1s infinite",
          }}
        >
          Kpandji au SIREXE 2026
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in mb-8 max-w-md text-center text-sm text-white/50 sm:max-w-lg sm:text-base md:mb-12 lg:text-lg">
          Salon International des Mines, du Pétrole, du Gaz et de l'Énergie
        </p>

        {/* ── Animated center stage ── */}
        <div className="relative mb-10 flex h-[40vh] w-full max-w-4xl items-center justify-center sm:mb-12 md:mb-16 md:h-[50vh] lg:h-[55vh]">
          {/* Center connector glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl md:h-48 md:w-48" />

          {/* Theme SIREXE — slides from left */}
          <div className="animate-slide-left absolute left-0 top-1/2 z-10 w-[44%] -translate-y-1/2 sm:w-[40%] md:left-[3%] md:w-[38%] lg:w-[34%]">
            <div className="animate-float animate-glow">
              <Image
                src="/theme-sirexe.webp"
                alt="Thème officiel SIREXE"
                width={800}
                height={800}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
                priority
              />
            </div>
          </div>

          {/* Kpandji logo — slides from right */}
          <div className="animate-slide-right absolute right-0 top-1/2 z-20 w-[36%] -translate-y-1/2 sm:w-[32%] md:right-[3%] md:w-[30%] lg:w-[26%]">
            <div className="animate-float-delayed">
              <Image
                src="/logo.jpeg"
                alt="Kpandji Automobiles"
                width={500}
                height={500}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl ring-2 ring-amber-500/20"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── Bottom action buttons ── */}
        <div className="animate-fade-in-up flex w-full max-w-md flex-col items-center gap-4 sm:max-w-lg sm:flex-row sm:justify-center sm:gap-5 md:max-w-2xl md:gap-6">
          <Suspense
            fallback={
              <button className="w-full rounded-full px-8 py-4 font-semibold text-white/60 sm:w-auto">
                Chargement…
              </button>
            }
          >
            <SignInButton mode="modal">
              <button className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-amber-900/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] active:scale-95 sm:w-auto md:px-10 md:py-5 md:text-lg animate-attention">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Se connecter
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </button>
            </SignInButton>
          </Suspense>

          <Link href="/voitures" className="w-full sm:w-auto">
            <button className="group relative w-full overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-amber-400/40 hover:bg-white/15 hover:shadow-2xl hover:shadow-white/5 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] active:scale-95 sm:w-auto md:px-10 md:py-5 md:text-lg">
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg
                  className="h-5 w-5 text-amber-300 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
                Voir les Voitures Kpandji
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── Footer badge ── */}
      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-4 md:pb-6">
        <p className="text-[0.65rem] text-white/30 sm:text-xs">
          © 2026 Kpandji Automobiles — Tous droits réservés
        </p>
      </footer>
    </main>
  );
}
