---
title: Özellik — Enerji Takibi & Odak Modu
type: ozellik
tags: [flowmind, ozellik, enerji, focus, pomodoro]
updated: 2026-06-25
---

# ⚡ Enerji Takibi & 🎯 Odak Modu

İlgili: [[ozellik-ai-oneriler]] · [[mimari-backend]] · [[durum-guncel]]

Bu, FlowMind'ın **çekirdek farkı**: görevleri düz bir listede değil, kişinin
**enerji ritmine** göre planlamak.

## Enerji takibi

- `EnergyBar` bileşeni + `energy_logs` tablosu ([[mimari-backend]])
- `routes/energy.js` ile log; `routes/stats.js` ile trend
- **Enerji trend grafiği** Faz 10'da eklendi → [[gelisim-fazlari]]
- Amaç: kişisel **peak window**'ları (yüksek enerji saatleri) ortaya çıkarmak

## Odak modu (Pomodoro+)

- `app/(tabs)/focus.tsx` — ⚠️ şu an **redesign'da**, +488 satır → [[durum-guncel]]
- `routes/focus.js` + `focus_sessions` tablosu
- **Background timer** (`lib/backgroundTimer.ts`) — uygulama arka plandayken sayar (Faz 8)
- **Scheduled notifications** (`lib/notifications.ts` + `expo-notifications`) — mola/bitiş
- `expo-task-manager` + `expo-background-fetch` ile arka plan görevleri

## Bağlantı

Enerji verisi → AI planlamasını besler → [[ozellik-ai-oneriler]].
Tamamlanan odak oturumları → XP/streak → [[ozellik-gamification]].
