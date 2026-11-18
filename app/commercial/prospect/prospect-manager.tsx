"use client";

import { useState, useEffect } from "react";

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

const KPANDJI_MODELES = [
  "KPANDJI DJETRAN",
  "KPANDJI DJETRAN+",
  "KPANDJI SOURALAI",
  "KPANDJI LATHAYE",
  "KPANDJI ANGNAFIN",
];

const DELAI_OPTIONS = [
  { value: "immediat", label: "Immédiat" },
  { value: "2semaines", label: "Dans 2 semaines" },
  { value: "1mois", label: "Dans 1 mois" },
];

export function ProspectManager() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [intentionModalOpen, setIntentionModalOpen] = useState(false);
  const [savedProspectId, setSavedProspectId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: "",
    contact: "",
    email: "",
    responsabilite: "",
    entreprise: "",
    localisation: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Intention form state
  const [intentionForm, setIntentionForm] = useState<Intention>({
    nom: "",
    telephone: "",
    whatsapp: "",
    pays: "",
    email: "",
    modeles: [],
    autreModele: "",
    delaiDecision: "",
    observations: "",
    date: "",
  });
  const [intentionErrors, setIntentionErrors] = useState<Record<string, boolean>>({});

  // Load prospects from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProspects(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save to localStorage whenever prospects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
  }, [prospects]);

  const openModal = () => {
    setForm({
      nom: "",
      contact: "",
      email: "",
      responsabilite: "",
      entreprise: "",
      localisation: "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.nom.trim()) newErrors.nom = true;
    if (!form.contact.trim()) newErrors.contact = true;
    if (!form.email.trim()) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newId = `prospect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newProspect: Prospect = {
      id: newId,
      nom: form.nom.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      responsabilite: form.responsabilite.trim(),
      entreprise: form.entreprise.trim(),
      localisation: form.localisation.trim(),
      createdAt: new Date().toISOString(),
      intention: null,
    };

    setProspects((prev) => [newProspect, ...prev]);
    setModalOpen(false);

    // Open the intention modal, pre-filled with prospect data
    setSavedProspectId(newId);
    setIntentionForm({
      nom: newProspect.nom,
      telephone: newProspect.contact,
      whatsapp: "",
      pays: newProspect.localisation,
      email: newProspect.email,
      modeles: [],
      autreModele: "",
      delaiDecision: "",
      observations: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIntentionErrors({});
    setIntentionModalOpen(true);
  };

  // ── Intention form handlers ──
  const handleIntentionChange = (field: string, value: string) => {
    setIntentionForm((prev) => ({ ...prev, [field]: value }));
    if (intentionErrors[field]) {
      setIntentionErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const toggleModele = (modele: string) => {
    setIntentionForm((prev) => {
      const has = prev.modeles.includes(modele);
      return {
        ...prev,
        modeles: has
          ? prev.modeles.filter((m) => m !== modele)
          : [...prev.modeles, modele],
      };
    });
  };

  const validateIntention = () => {
    const newErrors: Record<string, boolean> = {};
    if (!intentionForm.nom.trim()) newErrors.nom = true;
    if (!intentionForm.telephone.trim()) newErrors.telephone = true;
    if (!intentionForm.email.trim()) newErrors.email = true;
    setIntentionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIntentionSave = () => {
    if (!validateIntention()) return;

    if (savedProspectId) {
      setProspects((prev) =>
        prev.map((p) =>
          p.id === savedProspectId
            ? { ...p, intention: { ...intentionForm } }
            : p
        )
      );
    }
    setIntentionModalOpen(false);
    setSavedProspectId(null);
  };

  const handleIntentionSkip = () => {
    setIntentionModalOpen(false);
    setSavedProspectId(null);
  };

  const handleDelete = (id: string) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  };

  // Format date for display
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

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const stats = {
    total: prospects.length,
    nouveaux: prospects.filter((p) => {
      const days = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    }).length,
    avecIntention: prospects.filter((p) => p.intention).length,
  };

  return (
    <>
      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <svg className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Nouveaux</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{stats.nouveaux}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">7 derniers jours</p>
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
          <p className="text-2xl font-black text-white md:text-3xl">{stats.total}</p>
          <p className="text-[0.6rem] text-white/30 md:text-xs">À recontacter</p>
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-[0.6rem] font-medium uppercase tracking-wider text-white/40 md:text-xs">Total</span>
          </div>
          <p className="text-2xl font-black text-white md:text-3xl">{stats.total}</p>
        </div>
      </div>

      {/* Add prospect button + header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white md:text-xl">Liste des prospects</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:from-indigo-400 hover:to-indigo-600 active:scale-95 md:text-sm"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau prospect
        </button>
      </div>

      {/* Prospect list or empty state */}
      {prospects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
            <svg className="h-8 w-8 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/40">Aucun prospect pour le moment</p>
          <p className="mt-1 text-xs text-white/25">Cliquez sur « Nouveau prospect » pour commencer</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prospects.map((prospect) => (
            <div
              key={prospect.id}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-indigo-500/20 hover:bg-indigo-500/[0.03] md:p-5"
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-0.5 rounded-full bg-indigo-500/20 blur-sm" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-black text-white md:h-12 md:w-12 md:text-sm">
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
                      <p className="text-xs text-indigo-400/50 md:text-sm">{prospect.responsabilite}</p>
                    )}
                  </div>

                  {/* Contact details */}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <a
                      href={`tel:${prospect.contact}`}
                      className="flex items-center gap-1.5 text-[0.65rem] text-white/40 transition-colors hover:text-indigo-300 md:text-xs"
                    >
                      <svg className="h-3 w-3 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {prospect.contact}
                    </a>
                    <a
                      href={`mailto:${prospect.email}`}
                      className="flex items-center gap-1.5 text-[0.65rem] text-white/40 transition-colors hover:text-indigo-300 md:text-xs"
                    >
                      <svg className="h-3 w-3 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {prospect.email}
                    </a>
                    {prospect.localisation && (
                      <span className="flex items-center gap-1.5 text-[0.65rem] text-white/40 md:text-xs">
                        <svg className="h-3 w-3 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {prospect.localisation}
                      </span>
                    )}
                  </div>

                  {/* Intention info if available */}
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
                          <span key={m} className="rounded-md border border-indigo-500/15 bg-indigo-500/5 px-1.5 py-0.5 text-[0.55rem] font-medium text-indigo-300/60">
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

                  {/* Created date */}
                  <p className="mt-2 text-[0.55rem] text-white/20 md:text-[0.6rem]">
                    Ajouté le {formatDate(prospect.createdAt)}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(prospect.id)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400 md:h-9 md:w-9"
                  aria-label="Supprimer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal 1: Nouveau Prospect ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 md:h-10 md:w-10">
                  <svg className="h-4 w-4 text-indigo-400 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0q-5 0-8.5 3.5T6 18m0 0v-3m0 3H3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white md:text-lg">Nouveau Prospect</h2>
                  <p className="text-[0.6rem] text-white/40 md:text-xs">Ajoutez un nouveau contact prospect</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/5 hover:text-white/60 md:h-9 md:w-9"
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative z-10 max-h-[60vh] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                    Nom et Prénoms <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    placeholder="Ex: Jean Kouassi"
                    className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3 md:text-base ${errors.nom ? "border-red-500/40" : "border-white/[0.08]"}`}
                  />
                  {errors.nom && <p className="mt-1 text-[0.6rem] text-red-400 md:text-xs">Le nom est requis</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                    Contact <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.contact}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                    placeholder="Ex: +225 07 00 00 00 00"
                    className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3 md:text-base ${errors.contact ? "border-red-500/40" : "border-white/[0.08]"}`}
                  />
                  {errors.contact && <p className="mt-1 text-[0.6rem] text-red-400 md:text-xs">Le contact est requis</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Ex: jean@exemple.com"
                    className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3 md:text-base ${errors.email ? "border-red-500/40" : "border-white/[0.08]"}`}
                  />
                  {errors.email && <p className="mt-1 text-[0.6rem] text-red-400 md:text-xs">L'email est requis</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">Responsabilité</label>
                  <input
                    type="text"
                    value={form.responsabilite}
                    onChange={(e) => handleInputChange("responsabilite", e.target.value)}
                    placeholder="Ex: Directeur Général"
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3 md:text-base"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">Entreprise</label>
                  <input
                    type="text"
                    value={form.entreprise}
                    onChange={(e) => handleInputChange("entreprise", e.target.value)}
                    placeholder="Ex: SARL Entreprise"
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3 md:text-base"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">Localisation</label>
                  <input
                    type="text"
                    value={form.localisation}
                    onChange={(e) => handleInputChange("localisation", e.target.value)}
                    placeholder="Ex: Cocody, Abidjan"
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3 md:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-end gap-3 border-t border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <button
                onClick={closeModal}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white md:text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:from-indigo-400 hover:to-indigo-600 active:scale-95 md:text-sm"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Fiche d'Intention ── */}
      {intentionModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          onClick={handleIntentionSkip}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow accents */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            {/* Modal header — styled like the PDF header */}
            <div className="relative z-10 border-b border-white/[0.06] bg-gradient-to-r from-[#0a0f18] to-[#0c1220] px-5 py-4 md:px-6 md:py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 md:h-11 md:w-11">
                    <svg className="h-5 w-5 text-amber-400 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black tracking-tight text-white md:text-lg">FICHE D'INTENTION</h2>
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-wider text-amber-300/60">Exposition</span>
                    </div>
                    <p className="text-[0.6rem] text-white/40 md:text-xs">Merci de remplir cette fiche, notre équipe vous recontactera rapidement.</p>
                  </div>
                </div>
                <button
                  onClick={handleIntentionSkip}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/5 hover:text-white/60 md:h-9 md:w-9"
                  aria-label="Fermer"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="relative z-10 max-h-[60vh] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <div className="space-y-5">
                {/* Nom & Prénom + Téléphone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                      Nom & Prénom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={intentionForm.nom}
                      onChange={(e) => handleIntentionChange("nom", e.target.value)}
                      placeholder="Nom & Prénom"
                      className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3 ${intentionErrors.nom ? "border-red-500/40" : "border-white/[0.08]"}`}
                    />
                    {intentionErrors.nom && <p className="mt-1 text-[0.6rem] text-red-400">Requis</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                      Téléphone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={intentionForm.telephone}
                      onChange={(e) => handleIntentionChange("telephone", e.target.value)}
                      placeholder="+225 07 00 00 00 00"
                      className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3 ${intentionErrors.telephone ? "border-red-500/40" : "border-white/[0.08]"}`}
                    />
                    {intentionErrors.telephone && <p className="mt-1 text-[0.6rem] text-red-400">Requis</p>}
                  </div>
                </div>

                {/* Numéro WhatsApp + Pays de résidence */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">Numéro WhatsApp</label>
                    <input
                      type="tel"
                      value={intentionForm.whatsapp}
                      onChange={(e) => handleIntentionChange("whatsapp", e.target.value)}
                      placeholder="WhatsApp"
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">Pays de Résidence</label>
                    <input
                      type="text"
                      value={intentionForm.pays}
                      onChange={(e) => handleIntentionChange("pays", e.target.value)}
                      placeholder="Côte d'Ivoire"
                      className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3"
                    />
                  </div>
                </div>

                {/* Adresse E-mail */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                    Adresse E-mail <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={intentionForm.email}
                    onChange={(e) => handleIntentionChange("email", e.target.value)}
                    placeholder="email@exemple.com"
                    className={`w-full rounded-lg border bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3 ${intentionErrors.email ? "border-red-500/40" : "border-white/[0.08]"}`}
                  />
                  {intentionErrors.email && <p className="mt-1 text-[0.6rem] text-red-400">Requis</p>}
                </div>

                {/* Modèle Kpandji Souhaité */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-white/60 md:text-sm">
                    Modèle KPANDJI Souhaité <span className="text-white/30">(cochez votre choix)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {KPANDJI_MODELES.map((modele) => {
                      const checked = intentionForm.modeles.includes(modele);
                      return (
                        <button
                          key={modele}
                          type="button"
                          onClick={() => toggleModele(modele)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all ${
                            checked
                              ? "border-amber-500/40 bg-amber-500/10"
                              : "border-white/[0.08] bg-white/[0.02] hover:border-amber-500/20"
                          }`}
                        >
                          <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all ${checked ? "border-amber-500 bg-amber-500" : "border-white/20"}`}>
                            {checked && (
                              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-[0.65rem] font-medium leading-tight md:text-xs ${checked ? "text-amber-300" : "text-white/50"}`}>
                            {modele}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Autre Modèle de Kpandji — the custom input requested by user */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                    Autre Modèle de Kpandji
                  </label>
                  <input
                    type="text"
                    value={intentionForm.autreModele}
                    onChange={(e) => handleIntentionChange("autreModele", e.target.value)}
                    placeholder="Spécifiez un autre modèle souhaité..."
                    className="w-full rounded-lg border border-amber-500/20 bg-amber-500/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-amber-500/[0.05] md:py-3"
                  />
                </div>

                {/* Délai de Décision */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-white/60 md:text-sm">
                    Délai de Décision
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DELAI_OPTIONS.map((opt) => {
                      const selected = intentionForm.delaiDecision === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleIntentionChange("delaiDecision", opt.value)}
                          className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
                            selected
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                              : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-amber-500/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Autre (Modèle, Besoin…) / Observations */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                    Autre (Modèle, Besoin…) / Observations
                  </label>
                  <textarea
                    value={intentionForm.observations}
                    onChange={(e) => handleIntentionChange("observations", e.target.value)}
                    placeholder="Précisez vos besoins, questions ou observations..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">Date</label>
                  <input
                    type="date"
                    value={intentionForm.date}
                    onChange={(e) => handleIntentionChange("date", e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-amber-500/40 focus:bg-white/[0.05] md:py-3 [color-scheme:dark]"
                  />
                </div>

                {/* Privacy note */}
                <p className="text-[0.55rem] text-white/25 md:text-[0.6rem]">
                  Vos informations servent uniquement à vous recontacter au sujet de votre projet.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <button
                onClick={handleIntentionSkip}
                className="text-xs font-medium text-white/40 transition-colors hover:text-white/60 md:text-sm"
              >
                Passer
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleIntentionSkip}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white md:text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleIntentionSave}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 active:scale-95 md:text-sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer la fiche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
