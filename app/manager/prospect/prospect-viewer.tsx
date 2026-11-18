"use client";

import { useState, useEffect, useMemo } from "react";

type Intention = {
  nom: string;
  telephone: string;
  whatsapp: string;
  pays: string;
  email: string;
  modeles: string[];
  autreModele: string;
  delaiDecision: string;
  observations: string;
  date: string;
};

type Prospect = {
  id: string;
  nom: string;
  contact: string;
  email: string;
  responsabilite: string;
  entreprise: string;
  localisation: string;
  createdAt: string;
  intention: Intention | null;
};

const STORAGE_KEY = "kpandji_prospects";

const DELAI_OPTIONS = [
  { value: "immediat", label: "Immédiat" },
  { value: "2semaines", label: "Dans 2 semaines" },
  { value: "1mois", label: "Dans 1 mois" },
];

export function ProspectViewer() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [search, setSearch] = useState("");
  const [filterIntention, setFilterIntention] = useState<"all" | "with" | "without">("all");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load prospects from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProspects(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setLoaded(true);
  }, []);

  // Refresh on focus (in case commercial added data in another tab)
  useEffect(() => {
    const onFocus = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProspects(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const filtered = useMemo(() => {
    let result = prospects;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nom.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.contact.toLowerCase().includes(q) ||
          p.entreprise.toLowerCase().includes(q) ||
          p.localisation.toLowerCase().includes(q) ||
          p.responsabilite.toLowerCase().includes(q)
      );
    }
    if (filterIntention === "with") {
      result = result.filter((p) => p.intention);
    } else if (filterIntention === "without") {
      result = result.filter((p) => !p.intention);
    }
    return result;
  }, [prospects, search, filterIntention]);

  const stats = {
    total: prospects.length,
    avecIntention: prospects.filter((p) => p.intention).length,
    sansIntention: prospects.filter((p) => !p.intention).length,
    nouveaux: prospects.filter((p) => {
      const days = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length,
  };

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

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleExport = () => {
    if (prospects.length === 0) return;
    const headers = ["Nom", "Contact", "Email", "Responsabilite", "Entreprise", "Localisation", "Date", "Intention_Modeles", "Intention_AutreModele", "Intention_Delai", "Intention_Observations"];
    const rows = prospects.map((p) => [
      `"${p.nom}"`,
      `"${p.contact}"`,
      `"${p.email}"`,
      `"${p.responsabilite}"`,
      `"${p.entreprise}"`,
      `"${p.localisation}"`,
      `"${formatDate(p.createdAt)}"`,
      `"${p.intention?.modeles.join("; ") || ""}"`,
      `"${p.intention?.autreModele || ""}"`,
      `"${p.intention ? (DELAI_OPTIONS.find((d) => d.value === p.intention!.delaiDecision)?.label || "") : ""}"`,
      `"${p.intention?.observations || ""}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospects_kpandji_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Total</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{stats.total}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">Tous prospects</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Intentions</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{stats.avecIntention}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">Fiches remplies</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">En attente</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{stats.sansIntention}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">Sans fiche</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Nouveaux</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{stats.nouveaux}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">7 derniers jours</p>
        </div>
      </div>

      {/* Toolbar: Search + Filter + Export */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un prospect..."
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white placeholder-white/20 outline-none transition-all focus:border-emerald-500/40 focus:bg-white/[0.05] md:text-sm"
            />
          </div>
          {/* Filter */}
          <div className="flex gap-1.5">
            {[
              { val: "all" as const, label: "Tous" },
              { val: "with" as const, label: "Avec intention" },
              { val: "without" as const, label: "Sans intention" },
            ].map((f) => (
              <button
                key={f.val}
                onClick={() => setFilterIntention(f.val)}
                className={`rounded-lg border px-3 py-2 text-[0.65rem] font-bold transition-all md:text-xs ${
                  filterIntention === f.val
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:text-white/70"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {/* Export */}
        {prospects.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[0.65rem] font-bold text-emerald-300 transition-all hover:bg-emerald-500/10 md:text-xs"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter CSV
          </button>
        )}
      </div>

      {/* Prospect list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-8 w-8 text-emerald-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/40">
            {prospects.length === 0 ? "Aucun prospect enregistré" : "Aucun résultat"}
          </p>
          <p className="mt-1 text-xs text-white/25">
            {prospects.length === 0
              ? "Les prospects créés par les commerciaux apparaîtront ici"
              : "Essayez de modifier votre recherche"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((prospect) => (
            <div
              key={prospect.id}
              onClick={() => setSelectedProspect(prospect)}
              className="group cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] md:p-5"
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-0.5 rounded-full bg-emerald-500/20 blur-sm" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-black text-white md:h-12 md:w-12 md:text-sm">
                    {getInitials(prospect.nom)}
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-bold text-white md:text-base">{prospect.nom}</h3>
                      {prospect.entreprise && (
                        <span className="hidden rounded-full border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[0.55rem] font-medium text-amber-300/60 sm:inline-block">
                          {prospect.entreprise}
                        </span>
                      )}
                      {prospect.intention && (
                        <span className="hidden rounded-full border border-green-500/20 bg-green-500/5 px-2 py-0.5 text-[0.55rem] font-medium text-green-300/60 sm:inline-block">
                          Fiche d'intention
                        </span>
                      )}
                    </div>
                    {prospect.responsabilite && (
                      <p className="text-xs text-emerald-400/50 md:text-sm">{prospect.responsabilite}</p>
                    )}
                  </div>

                  {/* Contact details */}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-[0.65rem] text-white/40 md:text-xs">
                      <svg className="h-3 w-3 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {prospect.contact}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.65rem] text-white/40 md:text-xs">
                      <svg className="h-3 w-3 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {prospect.email}
                    </span>
                    {prospect.localisation && (
                      <span className="flex items-center gap-1.5 text-[0.65rem] text-white/40 md:text-xs">
                        <svg className="h-3 w-3 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {prospect.localisation}
                      </span>
                    )}
                  </div>

                  {/* Intention badges */}
                  {prospect.intention && (
                    <div className="mt-3 rounded-lg border border-green-500/10 bg-green-500/[0.03] p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <svg className="h-3 w-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-[0.6rem] font-bold uppercase tracking-wider text-green-400/60">Fiche d'intention</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prospect.intention.modeles.map((m) => (
                          <span key={m} className="rounded-md border border-emerald-500/15 bg-emerald-500/5 px-1.5 py-0.5 text-[0.55rem] font-medium text-emerald-300/60">
                            {m}
                          </span>
                        ))}
                        {prospect.intention.autreModele && (
                          <span className="rounded-md border border-amber-500/15 bg-amber-500/5 px-1.5 py-0.5 text-[0.55rem] font-medium text-amber-300/60">
                            Autre: {prospect.intention.autreModele}
                          </span>
                        )}
                      </div>
                      {prospect.intention.delaiDecision && (
                        <p className="mt-1.5 text-[0.55rem] text-white/30">
                          Délai: {DELAI_OPTIONS.find((d) => d.value === prospect.intention!.delaiDecision)?.label || prospect.intention.delaiDecision}
                        </p>
                      )}
                    </div>
                  )}

                  <p className="mt-2 text-[0.55rem] text-white/20 md:text-[0.6rem]">
                    Ajouté le {formatDate(prospect.createdAt)}
                  </p>
                </div>

                {/* Detail arrow */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/20 transition-all group-hover:text-emerald-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedProspect && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedProspect(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-0.5 rounded-full bg-emerald-500/20 blur-sm" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-black text-white md:h-12 md:w-12 md:text-sm">
                    {getInitials(selectedProspect.nom)}
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white md:text-lg">{selectedProspect.nom}</h2>
                  <p className="text-[0.6rem] text-white/40 md:text-xs">Détails du prospect</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProspect(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/5 hover:text-white/60 md:h-9 md:w-9"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 max-h-[60vh] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <div className="space-y-4">
                {/* Contact info */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Contact</p>
                    <p className="text-sm text-white">{selectedProspect.contact}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Email</p>
                    <p className="text-sm text-white break-all">{selectedProspect.email}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Responsabilité</p>
                    <p className="text-sm text-white">{selectedProspect.responsabilite || "—"}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Entreprise</p>
                    <p className="text-sm text-white">{selectedProspect.entreprise || "—"}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Localisation</p>
                    <p className="text-sm text-white">{selectedProspect.localisation || "—"}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Date</p>
                    <p className="text-sm text-white">{formatDate(selectedProspect.createdAt)}</p>
                  </div>
                </div>

                {/* Intention details */}
                {selectedProspect.intention ? (
                  <div className="rounded-xl border border-green-500/15 bg-green-500/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h3 className="text-sm font-bold text-green-300">Fiche d'Intention</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Téléphone</p>
                        <p className="text-xs text-white">{selectedProspect.intention.telephone}</p>
                      </div>
                      <div>
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-white/30">WhatsApp</p>
                        <p className="text-xs text-white">{selectedProspect.intention.whatsapp || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Pays</p>
                        <p className="text-xs text-white">{selectedProspect.intention.pays || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Délai</p>
                        <p className="text-xs text-white">
                          {DELAI_OPTIONS.find((d) => d.value === selectedProspect.intention!.delaiDecision)?.label || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Modèles souhaités</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProspect.intention.modeles.map((m) => (
                          <span key={m} className="rounded-md border border-emerald-500/15 bg-emerald-500/5 px-1.5 py-0.5 text-[0.55rem] font-medium text-emerald-300/60">
                            {m}
                          </span>
                        ))}
                        {selectedProspect.intention.autreModele && (
                          <span className="rounded-md border border-amber-500/15 bg-amber-500/5 px-1.5 py-0.5 text-[0.55rem] font-medium text-amber-300/60">
                            Autre: {selectedProspect.intention.autreModele}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedProspect.intention.observations && (
                      <div className="mt-3">
                        <p className="mb-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30">Observations</p>
                        <p className="text-xs text-white/60">{selectedProspect.intention.observations}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-4 text-center">
                    <p className="text-xs text-amber-300/60">Aucune fiche d'intention remplie</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-end gap-3 border-t border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <button
                onClick={() => setSelectedProspect(null)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white md:text-sm"
              >
                Fermer
              </button>
              <a
                href={`mailto:${selectedProspect.email}`}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:from-emerald-400 hover:to-emerald-600 active:scale-95 md:text-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contacter
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
