"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ScannedCard = {
  id: string;
  imageDataUrl: string;
  label: string;
  scannedAt: string;
};

const STORAGE_KEY = "kpandji_visite_cards";

export function CarteVisiteViewer() {
  const [cards, setCards] = useState<ScannedCard[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState<ScannedCard | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load cards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCards(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setLoaded(true);
  }, []);

  // Refresh on focus
  useEffect(() => {
    const onFocus = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCards(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const filtered = cards.filter((card) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      card.label.toLowerCase().includes(q) ||
      new Date(card.scannedAt).toLocaleDateString("fr-FR").includes(q)
    );
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Total</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{cards.length}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">Cartes scannées</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Récentes</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">
            {cards.filter((c) => {
              const days = (Date.now() - new Date(c.scannedAt).getTime()) / (1000 * 60 * 60 * 24);
              return days <= 7;
            }).length}
          </p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">7 derniers jours</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Recherche</span>
          </div>
          <p className="text-lg font-bold text-white md:text-xl">Filtrer</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">Par nom ou date</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une carte..."
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:bg-white/[0.05] md:text-sm"
          />
        </div>
      </div>

      {/* Cards grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-8 w-8 text-emerald-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/40">
            {cards.length === 0 ? "Aucune carte de visite scannée" : "Aucun résultat"}
          </p>
          <p className="mt-1 text-xs text-white/25">
            {cards.length === 0
              ? "Les cartes scannées par les commerciaux apparaîtront ici"
              : "Essayez de modifier votre recherche"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all hover:border-emerald-500/20"
            >
              {/* Card image */}
              <div className="relative aspect-[1.586/1] overflow-hidden bg-black/40">
                <Image
                  src={card.imageDataUrl}
                  alt={card.label}
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white">{card.label}</p>
                  <p className="text-[0.55rem] text-white/30">{formatDate(card.scannedAt)}</p>
                </div>
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/20 transition-all group-hover:text-emerald-400">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 md:h-10 md:w-10">
                  <svg className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white md:text-lg">{selectedCard.label}</h2>
                  <p className="text-[0.6rem] text-white/40 md:text-xs">{formatDate(selectedCard.scannedAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/5 hover:text-white/60 md:h-9 md:w-9"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="bg-black/60 p-4 md:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCard.imageDataUrl}
                alt={selectedCard.label}
                className="mx-auto max-h-[60vh] w-auto rounded-lg"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <a
                href={selectedCard.imageDataUrl}
                download={`${selectedCard.label.replace(/\s+/g, "_")}.jpg`}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/10 md:text-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger
              </a>
              <button
                onClick={() => setSelectedCard(null)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white md:text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
