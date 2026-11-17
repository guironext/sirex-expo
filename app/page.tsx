import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#07070a] text-foreground">
      {/* ─────────────────────────────────────────
           CINEMATIC BACKGROUND
      ───────────────────────────────────────── */}

      {/* Background image with Ken Burns */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Image
          src="/grand-public.webp"
          alt="SIREXE 2026"
          fill
          className="object-cover object-center opacity-40 animate-ken-burns"
          priority
          sizes="100vw"
        />
      </div>

      {/* Multi-layer dark gradient overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#07070a] via-[#07070a]/85 to-[#07070a]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(245,158,11,0.18),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.12),transparent_40%)]" />

      {/* Animated scanline */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.3), transparent)",
          height: "20%",
          animation: "scanline 8s linear infinite",
        }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* ─────────────────────────────────────────
           NAVIGATION
      ───────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 lg:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 backdrop-blur-2xl md:px-6">
          {/* Left: SIREXE logo */}
          <div className="animate-slide-left w-28 sm:w-36 md:w-44 lg:w-52">
            <Image
              src="/logo_fr.webp"
              alt="SIREXE 2026"
              width={260}
              height={70}
              className="h-auto w-full rounded-lg bg-white object-contain p-1 shadow-lg ring-1 ring-white/10"
              priority
            />
          </div>

          {/* Center: event dates pill */}
          <div className="hidden animate-fade-in rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md md:block">
            <span className="text-xs font-semibold tracking-wide text-amber-300">
              18 — 22 NOV 2026 · ABIDJAN
            </span>
          </div>

          {/* Right: Kpandji logo */}
          <div className="animate-slide-right flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-amber-500/30 blur-md animate-pulse-ring" />
              <Image
                src="/logo.jpeg"
                alt="Kpandji Automobiles"
                width={56}
                height={56}
                className="relative h-10 w-10 rounded-full shadow-2xl ring-2 ring-amber-500/40 sm:h-12 sm:w-12"
                priority
              />
            </div>
            <span className="hidden text-sm font-bold tracking-tight text-white lg:block">
              Kpandji
            </span>
          </div>
        </nav>
      </header>

      {/* ─────────────────────────────────────────
           HERO CONTENT
      ───────────────────────────────────────── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-28 md:pt-32 md:pb-32">
        {/* Top badge */}
        <div className="animate-fade-in mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          </span>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70 md:text-xs">
            Salon International des Mines, du Pétrole, du Gaz et de l'Énergie
          </span>
        </div>

        {/* Main title */}
        <h1
          className="animate-title max-w-5xl text-center text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #fbbf24 0%, #ffffff 25%, #fde68a 50%, #ffffff 75%, #fbbf24 100%)",
            backgroundSize: "300% 300%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation:
              "title-reveal 1s cubic-bezier(0.22,1,0.36,1) forwards, gradient-shift 6s ease 1s infinite",
          }}
        >
          Kpandji au
          <br />
          SIREXE 2026
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in mt-5 max-w-2xl text-center text-sm font-light leading-relaxed text-white/55 sm:text-base md:mt-6 md:text-lg">
          L'industrie automobile ivoirienne dévoile sa gamme 2026 au plus grand
          rendez-vous énergétique du continent.
        </p>

        {/* ── Visual stage: floating images ── */}
        <div className="animate-fade-in-up relative my-8 flex h-[35vh] w-full max-w-5xl items-center justify-center sm:my-10 sm:h-[42vh] md:my-12 md:h-[48vh] lg:h-[52vh]">
          {/* Central glow orb */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-[80px] md:h-60 md:w-60" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[40px]" />

          {/* Rotating decorative ring */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-500/10 opacity-60 sm:h-[360px] sm:w-[360px] md:h-[440px] md:w-[440px]"
            style={{ animation: "spin-slow 30s linear infinite" }}
          >
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500/50" />
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500/50" />
          </div>

          {/* Theme image left */}
          <div
            className="animate-slide-left absolute left-[2%] top-1/2 z-10 w-[46%] -translate-y-1/2 sm:left-[5%] sm:w-[40%] md:left-[8%] md:w-[36%] lg:w-[32%]"
            style={{ animation: "slide-from-left 1.4s cubic-bezier(0.22,1,0.36,1) forwards, float-3d 7s ease-in-out 1.4s infinite" }}
          >
            <div className="group relative">
              <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-500/30 via-amber-400/10 to-transparent opacity-60 blur-2xl transition-opacity group-hover:opacity-80" />
              <Image
                src="/theme-sirexe.webp"
                alt="Thème SIREXE 2026"
                width={700}
                height={700}
                className="relative h-auto w-full rounded-2xl object-contain shadow-2xl shadow-black/60 ring-1 ring-white/15"
                priority
              />
            </div>
          </div>

          {/* Kpandji logo right */}
          <div
            className="animate-slide-right absolute right-[2%] top-1/2 z-20 w-[38%] -translate-y-1/2 sm:right-[5%] sm:w-[34%] md:right-[8%] md:w-[30%] lg:w-[26%]"
            style={{ animation: "slide-from-right 1.4s cubic-bezier(0.22,1,0.36,1) forwards, float-3d-delayed 8s ease-in-out 1.4s infinite" }}
          >
            <div className="group relative">
              <div className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-br from-amber-500/25 via-white/5 to-transparent opacity-50 blur-2xl transition-opacity group-hover:opacity-80" />
              <Image
                src="/logo.jpeg"
                alt="Kpandji Automobiles"
                width={500}
                height={500}
                className="relative h-auto w-full rounded-3xl object-contain shadow-2xl shadow-black/60 ring-2 ring-amber-500/20"
                priority
              />
            </div>
          </div>
        </div>

        {/* Mobile date badge */}
        <div className="animate-fade-in mb-6 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md md:hidden">
          <span className="text-xs font-semibold tracking-wide text-amber-300">
            18 — 22 NOV 2026 · ABIDJAN
          </span>
        </div>

        {/* ── Action buttons ── */}
        <div className="animate-fade-in-up flex w-full max-w-4xl flex-col items-stretch gap-3 px-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:gap-5">
          {/* Primary CTA */}
          <Link href="/sign-in" className="w-full sm:w-auto">
              <button className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-amber-900/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 hover:shadow-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#07070a] active:scale-95 sm:w-auto md:px-10 md:py-5 md:text-lg animate-attention">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                </span>
              </button>
          </Link>

          {/* Secondary CTA */}
          <Link href="/voitures" className="w-full sm:w-auto">
            <button className="group relative w-full overflow-hidden rounded-2xl border border-white/20 bg-white/[0.07] px-8 py-4 text-base font-bold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-amber-400/40 hover:bg-white/[0.12] hover:shadow-2xl hover:shadow-white/5 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#07070a] active:scale-95 sm:w-auto md:px-10 md:py-5 md:text-lg">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="h-5 w-5 text-amber-300 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Voir les Voitures Kpandji
              </span>
            </button>
          </Link>

          {/* Tertiary CTA */}
          <Link href="/alternateur-tpo" className="w-full sm:w-auto">
            <button className="group relative w-full overflow-hidden rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.08] px-8 py-4 text-base font-bold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-500/[0.15] hover:shadow-2xl hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:ring-offset-2 focus:ring-offset-[#07070a] active:scale-95 sm:w-auto md:px-10 md:py-5 md:text-lg">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="h-5 w-5 text-cyan-300 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Alternateur TPO
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────
           FOOTER
      ───────────────────────────────────────── */}
      <footer className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center justify-center gap-1 pb-4 md:pb-6">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent md:w-48" />
        <p className="mt-2 text-center text-[0.6rem] text-white/30 sm:text-xs">
          © 2026 Kpandji Automobiles — Tous droits réservés
        </p>
      </footer>
    </main>
  );
}
