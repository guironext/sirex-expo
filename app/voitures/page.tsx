"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import pagesData from "@/public/catalogue2/pages.json";

type CataloguePage = {
  num: number;
  title: string;
  text: string;
};

const pages: CataloguePage[] = pagesData as CataloguePage[];

export default function VoituresPage() {
  const [activePage, setActivePage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track scroll progress and active page
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      // Find which page is currently in view
      const viewportMid = window.innerHeight / 2;
      let closest = 1;
      let closestDist = Infinity;
      pageRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i + 1;
        }
      });
      setActivePage(closest);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to a specific page
  const scrollToPage = (num: number) => {
    const ref = pageRefs.current[num - 1];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setNavOpen(false);
  };

  const activePageData = pages.find((p) => p.num === activePage);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#06080c] text-foreground">
      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.10),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_50%,rgba(6,182,212,0.05),transparent_40%)]" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* ── Scroll progress bar ── */}
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06080c]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          {/* Left: logo + title */}
          <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-amber-500/20 blur-sm" />
              <Image
                src="/logo.jpeg"
                alt="Kpandji"
                width={40}
                height={40}
                className="relative h-8 w-8 rounded-full ring-1 ring-amber-500/30 md:h-10 md:w-10"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-white md:text-base">
                Collection 2026
              </span>
              <span className="hidden text-[0.6rem] text-amber-400/50 sm:block md:text-xs">
                Kpandji Automobiles · Modèles Phares
              </span>
            </div>
          </Link>

          {/* Right: page nav + download + sign in */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Page navigator */}
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:border-amber-400/30 hover:bg-amber-500/10 active:scale-95 md:px-4"
            >
              <span className="text-amber-300">{String(activePage).padStart(2, "0")}</span>
              <span className="text-white/20">/</span>
              <span className="text-white/40">{String(pages.length).padStart(2, "0")}</span>
            </button>

            {/* Download button */}
            <a
              href="/catalogue2.pdf"
              download
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 active:scale-95 sm:flex md:px-4 md:text-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              <span className="hidden md:inline">Télécharger</span>
            </a>

            <Link href="/sign-in">
              <button className="flex-shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400/30 hover:bg-white/10 active:scale-95 md:px-4 md:py-2.5 md:text-sm">
                Se connecter
              </button>
            </Link>
          </div>
        </div>

        {/* Page dropdown nav */}
        {navOpen && (
          <div className="border-t border-white/[0.06] bg-[#06080c]/95 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-1.5 px-4 py-3 md:px-8">
              {pages.map((page) => (
                <button
                  key={page.num}
                  onClick={() => scrollToPage(page.num)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all md:h-10 md:w-10 ${
                    activePage === page.num
                      ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20"
                      : "border border-white/10 bg-white/5 text-white/40 hover:border-amber-400/20 hover:text-white/70"
                  }`}
                  title={page.title}
                >
                  {page.num}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-6 pb-4 text-center md:pt-10 md:pb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 md:px-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wider text-amber-300/80 md:text-xs">
            Catalogue Complet · {pages.length} Pages
          </span>
        </div>

        <h1
          className="mb-2 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl"
          style={{
            backgroundImage: "linear-gradient(135deg, #fcd34d 0%, #ffffff 30%, #fcd34d 60%, #ffffff 90%)",
            backgroundSize: "200% auto",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradient-shift 6s ease infinite",
          }}
        >
          Modèles Phares 2026
        </h1>

        <p className="mx-auto max-w-lg text-xs leading-relaxed text-white/45 sm:text-sm md:max-w-xl md:text-base">
          La force d'une racine, l'élan d'une nation — Découvrez la gamme complète KPANDJI Automobiles.
        </p>

        {/* Download + back buttons */}
        <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <a
            href="/catalogue2.pdf"
            download
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 active:scale-95 sm:w-auto md:text-sm"
          >
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Télécharger le catalogue
          </a>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400/30 hover:bg-white/10 active:scale-95 sm:w-auto md:text-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Accueil
          </Link>
        </div>
      </section>

      {/* ── Scroll hint ── */}
      <div className="relative z-10 mb-4 flex justify-center md:mb-6">
        <div className="flex flex-col items-center gap-1 text-white/20">
          <span className="text-[0.55rem] uppercase tracking-widest md:text-[0.6rem]">Défiler</span>
          <svg className="h-4 w-4 animate-bounce md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* ── Active page title bar ── */}
      {activePageData && (
        <div className="relative z-10 mx-auto mb-4 max-w-5xl px-4 md:mb-6">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 backdrop-blur-sm">
            <div className="flex h-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 px-2 text-[0.65rem] font-black text-white shadow-lg shadow-amber-500/20 md:h-8 md:text-xs">
              {String(activePageData.num).padStart(2, "0")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white md:text-sm">{activePageData.title}</p>
              <p className="truncate text-[0.6rem] text-white/30 md:text-xs">{activePageData.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Catalogue pages ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-3 pb-16 md:px-6 md:pb-24">
        <div className="flex flex-col gap-6 md:gap-10">
          {pages.map((page, index) => {
            const isActive = activePage === page.num;
            const isFirst = index === 0;

            return (
              <div
                key={page.num}
                ref={(el) => { pageRefs.current[index] = el; }}
                id={`page-${page.num}`}
                className="group relative scroll-mt-20"
              >
                {/* Page label bar */}
                <div className="mb-2.5 flex items-center gap-3 md:mb-3">
                  <div
                    className={`flex h-7 items-center justify-center rounded-lg text-[0.65rem] font-black transition-all duration-300 md:h-9 md:text-xs ${
                      isActive
                        ? "w-16 bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20"
                        : "w-7 border border-amber-500/20 bg-amber-500/5 text-amber-300/60"
                    }`}
                  >
                    {String(page.num).padStart(2, "0")}
                  </div>
                  <span className={`text-[0.55rem] font-medium transition-colors duration-300 md:text-xs ${isActive ? "text-amber-300/70" : "text-white/20"}`}>
                    {page.title}
                  </span>
                  <div className={`h-px flex-1 transition-all duration-300 ${isActive ? "bg-gradient-to-r from-amber-500/40 to-transparent" : "bg-gradient-to-r from-white/10 to-transparent"}`} />
                  <span className={`text-[0.55rem] transition-colors duration-300 md:text-xs ${isActive ? "text-amber-300/70" : "text-white/20"}`}>
                    {page.num} / {pages.length}
                  </span>
                </div>

                {/* Image card */}
                <div
                  className={`relative overflow-hidden rounded-lg border transition-all duration-500 md:rounded-xl ${
                    isActive
                      ? "border-amber-500/25 shadow-2xl shadow-amber-500/5"
                      : "border-white/[0.06] shadow-xl shadow-black/40"
                  } mx-auto max-w-3xl`}
                >
                  {/* Glow on active */}
                  {isActive && (
                    <div className="pointer-events-none absolute -inset-0.5 z-0 rounded-lg bg-gradient-to-br from-amber-500/10 to-transparent opacity-50 blur-lg md:rounded-xl" />
                  )}

                  <div className="relative z-10 bg-white/[0.01]">
                    <Image
                      src={`/catalogue2/page-${String(page.num).padStart(2, "0")}.jpg`}
                      alt={`Catalogue Kpandji 2026 — Page ${page.num} — ${page.title}`}
                      width={1190}
                      height={1684}
                      className="h-auto w-full object-contain"
                      sizes="(max-width: 768px) 100vw, 768px"
                      priority={isFirst}
                    />
                  </div>

                  {/* Top edge highlight */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>

        {/* End of catalogue */}
        <div className="mt-10 text-center md:mt-14">
          <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent md:w-48" />
          <p className="mt-3 text-[0.6rem] text-white/25 md:text-xs">
            Fin du catalogue — {pages.length} pages
          </p>
          <p className="mt-1 text-[0.6rem] text-amber-400/30 md:text-xs">
            La force d'une racine, l'élan d'une nation
          </p>
        </div>
      </section>

      {/* ── Floating quick-nav (desktop side dots) ── */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1.5 lg:flex">
        {pages.map((page) => (
          <button
            key={page.num}
            onClick={() => scrollToPage(page.num)}
            className={`group relative flex h-2.5 w-2.5 items-center justify-center rounded-full transition-all duration-300 ${
              activePage === page.num
                ? "scale-125 bg-amber-400 shadow-lg shadow-amber-500/30"
                : "bg-white/15 hover:bg-white/40"
            }`}
            aria-label={`Page ${page.num} — ${page.title}`}
          >
            <span className="absolute right-5 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-[0.55rem] font-bold text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
              {page.num} · {page.title}
            </span>
          </button>
        ))}
      </div>

      {/* ── Mobile floating page indicator ── */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-2 backdrop-blur-xl">
          <span className="text-xs font-black text-amber-300">{activePage}</span>
          <span className="text-[0.6rem] text-white/20">/</span>
          <span className="text-xs font-medium text-white/40">{pages.length}</span>
        </div>
      </div>
    </main>
  );
}
