"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type ScannedCard = {
  id: string;
  imageDataUrl: string;
  label: string;
  scannedAt: string;
};

const STORAGE_KEY = "kpandji_visite_cards";

export function CarteVisiteManager() {
  const [cards, setCards] = useState<ScannedCard[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraStream(stream);
      setCameraActive(true);
      // Wait for video element to render, then set srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions ou utilisez l'option d'import.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreviewUrl(dataUrl);
    stopCamera();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setPreviewUrl(result);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const openModal = () => {
    setLabel("");
    setPreviewUrl(null);
    setError("");
    setCameraActive(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    stopCamera();
    setModalOpen(false);
    setLabel("");
    setPreviewUrl(null);
    setError("");
  };

  const handleSave = () => {
    if (!previewUrl) {
      setError("Veuillez scanner ou importer une carte de visite.");
      return;
    }

    const newCard: ScannedCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      imageDataUrl: previewUrl,
      label: label.trim() || "Carte de visite",
      scannedAt: new Date().toISOString(),
    };

    setCards((prev) => [newCard, ...prev]);
    closeModal();
  };

  const handleDelete = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
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

  return (
    <>
      {/* Top button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white md:text-xl">Cartes scannées</h2>
          {cards.length > 0 && (
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[0.6rem] font-bold text-indigo-300/60">
              {cards.length}
            </span>
          )}
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:from-indigo-400 hover:to-indigo-600 active:scale-95 md:text-sm"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter Nouvelle Carte
        </button>
      </div>

      {/* Cards grid or empty state */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
            <svg className="h-8 w-8 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/40">Aucune carte scannée</p>
          <p className="mt-1 text-xs text-white/25">Cliquez sur « Ajouter Nouvelle Carte » pour scanner</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all hover:border-indigo-500/20"
            >
              {/* Card image */}
              <div className="relative aspect-[1.586/1] overflow-hidden bg-black/40">
                <Image
                  src={card.imageDataUrl}
                  alt={card.label}
                  fill
                  className="object-contain"
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
                <button
                  onClick={() => handleDelete(card.id)}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Supprimer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Scanner / Import ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal content */}
          <div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow accents */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl" />

            {/* Modal header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 md:h-10 md:w-10">
                  <svg className="h-4 w-4 text-indigo-400 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white md:text-lg">Scanner une Carte</h2>
                  <p className="text-[0.6rem] text-white/40 md:text-xs">Scannez avec la caméra ou importez une image</p>
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

            {/* Content */}
            <div className="relative z-10 max-h-[60vh] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              {/* Camera view / preview */}
              <div className="mb-4">
                {cameraActive ? (
                  /* Live camera */
                  <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-black">
                    <video
                      ref={videoRef}
                      className="h-auto w-full"
                      autoPlay
                      playsInline
                      muted
                    />
                    {/* Scan frame overlay */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="relative h-[200px] w-[320px] border-2 border-indigo-400/60 rounded-lg">
                        <div className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-indigo-400" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 border-t-2 border-r-2 border-indigo-400" />
                        <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-indigo-400" />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-indigo-400" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <button
                        onClick={capturePhoto}
                        className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-indigo-500 shadow-lg transition-all hover:scale-110 active:scale-95"
                        aria-label="Capturer"
                      >
                        <div className="h-10 w-10 rounded-full border-2 border-white" />
                      </button>
                    </div>
                  </div>
                ) : previewUrl ? (
                  /* Captured/imported preview */
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Aperçu carte"
                      className="h-auto w-full object-contain"
                    />
                    {/* Retake button */}
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        startCamera();
                      }}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-black/90"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refaire
                    </button>
                  </div>
                ) : (
                  /* Idle state — choose method */
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] py-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
                      <svg className="h-7 w-7 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Scanner avec caméra
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-white/70 transition-all hover:border-indigo-400/30 hover:bg-white/[0.05] hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Importer une image
                      </button>
                    </div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Label input */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/60 md:text-sm">
                  Nom / Description
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ex: Carte de Jean Kouassi — Directeur"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] md:py-3"
                />
              </div>
            </div>

            {/* Hidden canvas for photo capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Modal footer */}
            <div className="relative z-10 flex items-center justify-end gap-3 border-t border-white/[0.06] px-5 py-4 md:px-6 md:py-5">
              <button
                onClick={closeModal}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.05] hover:text-white md:text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!previewUrl}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-lg transition-all md:text-sm ${
                  previewUrl
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-indigo-500/20 hover:scale-105 hover:from-indigo-400 hover:to-indigo-600 active:scale-95"
                    : "cursor-not-allowed bg-white/[0.05] text-white/30"
                }`}
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
    </>
  );
}
