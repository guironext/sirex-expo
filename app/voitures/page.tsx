"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { SignInButton } from "@clerk/nextjs";

import pagesData from "@/public/catalogue/pages.json";

type CataloguePage = {
  num: number;
  title: string;
  text: string;
};

const allPages: CataloguePage[] = pagesData as CataloguePage[];
// Remove pages 1, 2, 3, and 4
const pages: CataloguePage[] = allPages.filter((p) => p.num > 4);

export default function VoituresPage() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = pages.length;
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = ((index % total) + total) % total;
      setCurrent(clamped);
    },
    [total]
  );

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Track which image is closest to center based on scroll position
  useEffect(() => {
    if (isPaused) return;
    let raf = 0;
    const check = () => {
      const track = trackRef.current;
      if (track) {
        const trackRect = track.getBoundingClientRect();
        const viewportCenter = window.innerWidth / 2;
        // Find which card is closest to viewport center
        const cards = track.querySelectorAll("[data-card-index]");
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - viewportCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = parseInt(card.getAttribute("data-card-index") || "0");
          }
        });
        setActiveIndex(closest % total);
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Duplicate pages for seamless infinite scroll
  const scrollPages = [...pages, ...pages];
  const currentPage = pages[current];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#08080d] via-[#0d0a15] to-[#08080d] text-foreground">
      {/* ── Subtle background ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(245,158,11,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(168,85,247,0.04),transparent_40%)]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08080d]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
            <div className="relative">
              <Image
                src="/logo.jpeg"
                alt="Kpandji"
                width={40}
                height={40}
                className="h-8 w-8 rounded-full ring-1 ring-amber-500/30 md:h-10 md:w-10"
              />
            </div>
            <span className="text-sm font-bold tracking-tight text-white md:text-base">
              Catalogue Kpandji 2026
            </span>
          </Link>

          <Suspense fallback={null}>
            <SignInButton mode="modal">
              <button className="rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 active:scale-95 md:px-6 md:py-2.5 md:text-sm">
                Se connecter
              </button>
            </SignInButton>
          </Suspense>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-3 text-center md:pt-10 md:pb-4">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[0.65rem] font-medium uppercase tracking-wider text-amber-300/80 md:text-xs">
              Collection 2026
            </span>
          </div>
          <a
            href="/catalogue.pdf"
            download
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-1.5 text-[0.65rem] font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 active:scale-95 md:px-5 md:text-xs"
          >
            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Télécharger le catalogue
          </a>
        </div>
        <h1 className="mb-2 text-3xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          Nos Voitures Kpandji
        </h1>
        <p className="mx-auto max-w-xl text-xs text-white/40 md:text-sm">
          5 modèles d'exception — conçus et assemblés en Côte d'Ivoire.
        </p>
      </section>

      {/* ── Auto-scrolling image strip: right to left ── */}
      <section className="relative z-10 pb-10 md:pb-14">
        {/* Marquee container with overflow hidden */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Scrolling track */}
          <div
            ref={trackRef}
            className="flex w-max"
            style={{
              animation: "scroll-rtl 60s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {scrollPages.map((page, i) => {
              const realIndex = i % total;
              const isActive = realIndex === activeIndex;

              return (
                <div
                  key={`${page.num}-${i}`}
                  data-card-index={realIndex}
                  className="relative flex flex-shrink-0 flex-col items-center px-3 transition-all duration-500 md:px-5"
                  style={{
                    width: "500px",
                  }}
                >
                  <div
                    className="relative flex flex-col items-center transition-all duration-500"
                    style={{
                      transform: isActive ? "scale(1)" : "scale(0.7)",
                      opacity: isActive ? 1 : 0.35,
                      filter: isActive ? "none" : "brightness(0.35)",
                      zIndex: isActive ? 30 : 10,
                    }}
                  >
                    {/* Glow behind active card */}
                    {isActive && (
                      <div
                        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          width: "120%",
                          height: "120%",
                          background:
                            "radial-gradient(ellipse at center, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0.1) 30%, transparent 65%)",
                          filter: "blur(25px)",
                        }}
                      />
                    )}

                    <button
                      onClick={() => goTo(realIndex)}
                      className="group relative z-10 block w-full"
                    >
                      {/* Image card */}
                      <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{
                          boxShadow: isActive
                            ? "0 0 0 4px rgba(245,158,11,0.8), 0 0 40px 12px rgba(245,158,11,0.35), 0 20px 60px rgba(0,0,0,0.8)"
                            : "0 0 0 1px rgba(255,255,255,0.06), 0 8px 25px rgba(0,0,0,0.6)",
                        }}
                      >
                        <Image
                          src={`/catalogue/page-${String(page.num).padStart(2, "0")}.jpg`}
                          alt={`Page ${page.num} — ${page.title}`}
                          width={595}
                          height={842}
                          className="h-[550px] w-full object-cover md:h-[650px]"
                          sizes="500px"
                        />

                        {/* Dark overlay on non-active cards */}
                        {!isActive && (
                          <div className="pointer-events-none absolute inset-0 bg-black/55" />
                        )}

                        {/* Amber tint on active */}
                        {isActive && (
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-500/8 via-transparent to-amber-300/5" />
                        )}
                      </div>

                      {/* Page number badge */}
                      <div
                        className="absolute left-2 top-2 z-40 flex items-center justify-center rounded-full md:left-3 md:top-3"
                        style={{
                          width: isActive ? "2.25rem" : "1.25rem",
                          height: isActive ? "2.25rem" : "1.25rem",
                          background: isActive
                            ? "linear-gradient(135deg, #fbbf24, #d97706)"
                            : "rgba(0,0,0,0.7)",
                          color: isActive ? "#fff" : "rgba(255,255,255,0.35)",
                          fontWeight: isActive ? 900 : 500,
                          fontSize: isActive ? "0.8rem" : "0.55rem",
                          boxShadow: isActive ? "0 0 15px 4px rgba(245,158,11,0.5)" : "none",
                          border: isActive
                            ? "2px solid rgba(252,211,77,0.4)"
                            : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {page.num}
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-16 bg-gradient-to-r from-[#08080d] to-transparent md:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-[#08080d] to-transparent md:w-32" />
          {/* Center highlight zone indicator */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full -translate-x-1/2" style={{ width: "2px", background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.15), transparent)" }} />
        </div>

        {/* ── Controls ── */}
        <div className="mt-6 flex items-center justify-center gap-3 md:gap-5">
          <button
            onClick={prev}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-amber-400/40 hover:bg-amber-500/10 active:scale-95 md:h-11 md:w-11"
            aria-label="Précédent"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="text-sm font-black text-amber-300 md:text-base">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.65rem] text-white/20">/</span>
            <span className="text-xs font-medium text-white/40 md:text-sm">
              {String(total).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-all hover:scale-110 hover:text-amber-300 md:h-10 md:w-10"
            aria-label={isPaused ? "Reprendre" : "Pause"}
          >
            {isPaused ? (
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          <button
            onClick={next}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-amber-400/40 hover:bg-amber-500/10 active:scale-95 md:h-11 md:w-11"
            aria-label="Suivant"
          >
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Thumbnails ── */}
        <div className="mt-5 flex items-center justify-center gap-1 overflow-x-auto px-4 pb-2 md:gap-1.5">
          {pages.map((page, index) => (
            <button
              key={page.num}
              onClick={() => goTo(index)}
              className={`flex-shrink-0 rounded-md transition-all duration-300 ${
                index === activeIndex
                  ? "ring-2 ring-amber-400"
                  : "ring-1 ring-white/10 opacity-40 hover:opacity-70 hover:ring-white/20"
              }`}
              aria-label={`Page ${page.num}`}
              title={page.title}
            >
              <Image
                src={`/catalogue/page-${String(page.num).padStart(2, "0")}.jpg`}
                alt=""
                width={30}
                height={42}
                className={`rounded-md transition-all ${
                  index === activeIndex ? "h-10 w-7 md:h-12 md:w-9" : "h-8 w-6 md:h-10 md:w-7"
                } object-cover`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* ── Back to home ── */}
      <section className="relative z-10 pb-20 pt-2 text-center">
        <div className="flex justify-center">
          <Link href="/">
            <button className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400/30 hover:bg-white/10 active:scale-95">
              <svg className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l'accueil
            </button>
          </Link>
        </div>

        <p className="mt-5 text-[0.65rem] text-white/20">
          ← → pour naviguer · Espace pour pause
        </p>
      </section>
    </main>
  );
}
