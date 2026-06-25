---
title: Mimari — Genel Bakış
type: mimari
tags: [flowmind, mimari]
updated: 2026-06-25
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
| `backend/` | Express API + PostgreSQL | [[mimari-backend]] |
| `hooks/`, `types/` | Yardımcılar, tipler | |

## İki yönlü veri akışı

UI → Zustand store → `lib/api.ts` → Express → PostgreSQL → geri.
AI istekleri ayrı: UI → `lib/ai.ts` (`lib/aiCache.ts` ile) → OpenRouter → Gemma.

> ⚠️ `@supabase/supabase-js` bağımlı ama aktif kullanım belirsiz. Bkz. [[karar-defteri]].
