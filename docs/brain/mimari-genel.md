---
title: Mimari — Genel Bakış
type: mimari
tags: [flowmind, mimari]
updated: 2026-10-18
---

# 🏗️ Mimari — Genel Bakış

İlgili: [[00-FlowMind-MOC]] · [[mimari-frontend]] · [[mimari-backend]] · [[mimari-ai]] · [[mimari-state-zustand]] · [[mimari-deployment]]

## Sistem diyagramı

```
┌─────────────────────────────────────────────┐
│  MOBİL UYGULAMA  (React Native + Expo SDK54) │
│  app/ (expo-router)  ── [[mimari-frontend]]  │
│  stores/ (Zustand)   ── [[mimari-state-zustand]] │
│  lib/api.ts          ─┐                        │
│  lib/ai.ts ──────────┐│                        │
└──────────────────────┼┼────────────────────────┘
                       ││
              REST/JWT ││ OpenRouter
                       ▼▼
┌──────────────────┐  ┌──────────────────────────┐
│  VDS BACKEND     │  │  AI LAYER                 │
│  Express+Postgres│  │  OpenRouter → Gemma       │
│  [[mimari-backend]] │  [[mimari-ai]]            │
└──────────────────┘  └──────────────────────────┘
        │
        └── EAS Build → App Store  [[mimari-deployment]]
```

## Klasör → Katman eşlemesi

| Klasör | Sorumluluk | Not |
|---|---|---|
| `app/` | Ekranlar + yönlendirme (expo-router) | [[mimari-frontend]] |
| `components/ui/` | Yeniden kullanılır UI | premium redesign WIP → [[durum-guncel]] |
| `stores/` | İstemci durumu (Zustand) | [[mimari-state-zustand]] |
| `lib/` | Servisler (api, ai, cache, notifications, offline, timer) | [[mimari-ai]] |
| `constants/` | Tema, config | tema genişledi → [[durum-guncel]] |
| `backend/` | Express API + PostgreSQL | legal metinler: `legal-content.js` → [[mimari-backend]] |
| `hooks/`, `types/` | Yardımcılar, tipler | |

## İki yönlü veri akışı

UI → Zustand store → `lib/api.ts` → Express → PostgreSQL → geri.
AI istekleri de aynı yoldan gider: UI → `lib/ai.ts` (`lib/aiCache.ts` ile) →
`POST /api/ai/chat` (backend proxy) → OpenRouter → Gemma. İstemcide AI anahtarı yoktur.

> ⚠️ Yayına çıkmadan önce kapatılacaklar: [[yayin-engelleri]].
