---
title: Mimari — Frontend (React Native + Expo)
type: mimari
tags: [flowmind, mimari, frontend]
updated: 2026-06-25
---

# 📱 Frontend — React Native + Expo

İlgili: [[mimari-genel]] · [[mimari-state-zustand]] · [[durum-guncel]]

## Stack

- **React Native 0.81.5** + **Expo SDK 54** + **React 19**
- **TypeScript 5.7**
- **expo-router 6** (dosya tabanlı yönlendirme)
- **react-native-reanimated 4** + worklets (animasyon)
- **react-native-chart-kit** + `react-native-svg` (grafikler)
- **expo-blur** + **expo-linear-gradient** (yeni — premium UI için → [[durum-guncel]])

## Ekran haritası (`app/`)

```
app/
├── index.tsx              → açılış / yönlendirme
├── _layout.tsx            → kök layout
├── (onboarding)/welcome   → ilk kullanım
├── (auth)/login,register  → kimlik (redesign WIP)
└── (tabs)/
    ├── index    → Today (günlük plan)   → [[ozellik-ai-oneriler]]
    ├── tasks    → Görevler              → [[ozellik-gorev-yonetimi]]
    ├── focus    → Odak/Pomodoro (WIP)   → [[ozellik-enerji-ve-odak]]
    ├── stats    → İstatistikler          → [[ozellik-gamification]]
    ├── calendar → Takvim                 → [[ozellik-gorev-yonetimi]]
    └── profile  → Profil
```

## UI bileşenleri (`components/ui/`)

- Mevcut: `Button`, `TaskCard`, `EnergyBar`
- Yeni (redesign): `GlassCard`, `GlowOrb`, `GradientButton` → [[durum-guncel]]

## Servis katmanı (`lib/`)

`api.ts` (backend), `ai.ts`/`aiCache.ts` ([[mimari-ai]]), `notifications.ts`,
`backgroundTimer.ts`, `offlineStore.ts` → [[ozellik-enerji-ve-odak]]
