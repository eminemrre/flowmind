---
title: Mimari — State (Zustand)
type: mimari
tags: [flowmind, mimari, state]
updated: 2026-06-25
---

# 🔄 State Yönetimi — Zustand

İlgili: [[mimari-genel]] · [[mimari-frontend]] · [[ozellik-gamification]]

## Store'lar (`stores/`)

| Store | Sorumluluk | Bağlı |
|---|---|---|
| `authStore.ts` | oturum, token, kullanıcı | [[mimari-backend]] auth |
| `taskStore.ts` | görevler, CRUD, filtre | [[ozellik-gorev-yonetimi]] |
| `gamificationStore.ts` | XP, seviye, streak, rozet | [[ozellik-gamification]] |
| `settingsStore.ts` | tercihler, tema, bildirim | [[mimari-frontend]] |

## Desenler

- Token `authStore`'da → `lib/api.ts`'in `setToken()` ile senkron.
- Offline-first: `lib/offlineStore.ts` ile store'lar kalıcılaşır (AsyncStorage).
- `authStore` ve `gamificationStore` için **birim testleri** var (Faz 10) → [[gelisim-fazlari]]

## Test kapsamı

`__tests__/` (kök) — store testleri mevcut. Diğer store'lar için kapsam
genişletilebilir → [[sonraki-adimlar]]
