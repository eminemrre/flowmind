---
title: Özellik — Gamification
type: ozellik
tags: [flowmind, ozellik, gamification, xp]
updated: 2026-06-25
---

# 🏆 Gamification

İlgili: [[mimari-state-zustand]] · [[ozellik-gorev-yonetimi]] · [[ozellik-enerji-ve-odak]]

## Mekanikler

- **XP** sistemi — görev/odak tamamlama ile kazanılır
- **Seviye** atlama (animasyonlu)
- **Streak** — gün gün süreklilik takibi
- **Rozetler / achievements** — `routes/achievements.js` + `achievements` tablosu

## Teknik

- `gamificationStore.ts` (Zustand) → [[mimari-state-zustand]]
- `achievements.js` backend + `stats.js` ile görselleştirme
- **Birim testleri var** (Faz 10) — `gamificationStore` test edildi → [[gelisim-fazlari]]
- `stats.tsx` ekranında grafikler (`react-native-chart-kit`)

## Bağlantı

Tetikleyiciler: tamamlanan [[ozellik-gorev-yonetimi|görevler]] ve
[[ozellik-enerji-ve-odak|odak oturumları]] → XP/streak/rozet.
