#!/bin/bash
# ─────────────────────────────────────────────────────────
#  SIREXE 2026 — Push project to GitHub
#  Repo: https://github.com/guironext/sirex-expo.git
# ─────────────────────────────────────────────────────────

set -e

PROJECT_DIR="/Users/mac/Desktop/sirex-expo"
REMOTE_URL="https://github.com/guironext/sirex-expo.git"

cd "$PROJECT_DIR"

echo "▶ Initializing git repository..."
git init

echo "▶ Adding all files..."
git add -A

echo "▶ Creating initial commit..."
git commit -m "Initial commit — Kpandji Automobiles SIREXE 2026

Features:
- Next.js 16.4.6 with Turbopack, App Router, React 19
- Clerk authentication with role-based routing (admin/manager/commercial)
- Clerk webhook for automatic commercial role assignment
- /voitures page — catalogue2.pdf (18 pages rendered)
- /alternateur-tpo page — pto.pdf (18 pages rendered)
- /commercial dashboard with navbar (Accueil, Prospect, Carte de Visite)
- Prospect form with sequential Fiche d'Intention modal
- Business card scanner with camera + file import
- Manager account configured
- Tailwind CSS v4 theming"

echo "▶ Setting branch to main..."
git branch -M main

echo "▶ Removing existing remote (if any)..."
git remote remove origin 2>/dev/null || true

echo "▶ Adding remote origin..."
git remote add origin "$REMOTE_URL"

echo "▶ Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Project pushed to: $REMOTE_URL"
