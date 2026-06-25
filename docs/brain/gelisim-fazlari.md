---
title: Gelişim Fazları — Zaman Çizelgesi
type: zaman-cizelgesi
tags: [flowmind, fazlar, history]
updated: 2026-06-25
---

# 🗺️ Gelişim Fazları (git history)

İlgili: [[00-FlowMind-MOC]] · [[durum-guncel]] · [[karar-defteri]]

> ⚠️ `ROADMAP.md` dosyası **eskimiş** (Faz 2'yi %0 gösteriyor). Gerçek ilerleme
> git history'de. Bkz. [[karar-defteri]] → "Eskimiş dökümanlar".

## Kronolojik zincir

1. **Temel** — RN+Expo kurulumu, Expo Router, tab/auth/onboarding ekranları,
   Zustand store, tema, OpenRouter client → [[mimari-frontend]]
2. **Backend** — Express + PostgreSQL API (VDS), JWT auth, AI test scripti → [[mimari-backend]]
3. **Faz 4.1** — Task CRUD ekranları, profesyonel README → [[ozellik-gorev-yonetimi]]
4. **Faz 5+6** — Polish & UX + Test & CI/CD
5. **Faz 6.5** — İstatistik grafikleri, AI cache, ErrorBoundary, Skeleton → [[mimari-ai]]
6. **Faz 7** — App Store lansman hazırlığı (icon, EAS, privacy, store desc)
7. **Faz 8** — Background timer, offline mode, scheduled notifications → [[ozellik-enerji-ve-odak]]
8. **Faz 9** — Sesli görev, takvim görünümü, tekrarlayan görevler → [[ozellik-ai-oneriler]]
9. **Faz 10** — Enerji trend grafiği + authStore/gamificationStore testleri → [[ozellik-gamification]]
10. **Altyapı** — Docker, winston logging, graceful shutdown; Expo SDK 54 yükseltme (RN 0.81, React 19, reanimated 4)
11. **Submission** — EAS init, gerçek ikon, ascAppId pin, legal sayfalar → [[mimari-deployment]]
12. **▶ ŞİMDİ** — Premium UI redesign (commit'lenmemiş) → [[durum-guncel]]

## Teknik kilometre taşları

- **Expo SDK 52 → 54** geçişi yapıldı (RN 0.76 → 0.81, React 18 → 19).
  ⚠️ `README.md` hâlâ SDK 52 / RN 0.76 diyor → eskimiş, bkz. [[karar-defteri]].
- Recurring routes bir ara MVP dışı bırakıldı, sonra Faz 9'da geri geldi.
