---
title: Özellik — Görev Yönetimi
type: ozellik
tags: [flowmind, ozellik, gorev, task]
updated: 2026-06-25
---

# ✅ Görev Yönetimi

İlgili: [[mimari-state-zustand]] · [[mimari-backend]] · [[ozellik-ai-oneriler]]

## Kapsam

- Görev **CRUD** + tamamlama (`taskStore.ts` ↔ `routes/tasks.js`)
- Görev ekleme modal + düzenleme ekranı (Faz 4.1) → [[gelisim-fazlari]]
- Kategori / etiketler
- **Takvim görünümü** — `app/(tabs)/calendar.tsx` (Faz 9)
- **Tekrarlayan görevler** — `routes/recurring.js` + `migrations/003_recurring_tasks.sql`
  (Faz 9'da geri geldi; bir ara MVP dışı bırakılmıştı → [[karar-defteri]])

## Veri akışı

```
UI (tasks.tsx) → taskStore (Zustand) → lib/api.ts → routes/tasks.js → PostgreSQL
```

## Bağlantı

Görevler enerji seviyesine göre sıralanır → [[ozellik-enerji-ve-odak]].
AI, görevlerden günlük plan üretir → [[ozellik-ai-oneriler]].
Tamamlama → XP → [[ozellik-gamification]].
