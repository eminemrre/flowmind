---
title: Özellik — AI Öneriler & Sesli Görev
type: ozellik
tags: [flowmind, ozellik, ai]
updated: 2026-06-25
---

# 💡 AI Öneriler & Sesli Görev

İlgili: [[mimari-ai]] · [[ozellik-enerji-ve-odak]] · [[ozellik-gorev-yonetimi]]

## Yetenekler

- **Günlük AI plan/öneri** — Today ekranında (`app/(tabs)/index.tsx`)
- **Enerji bazlı planlama** — AI, enerji verisini girdi alır → [[ozellik-enerji-ve-odak]]
- **Sesli görev (voice-to-task)** — Faz 9'da eklendi → [[gelisim-fazlari]]
- **Bağlamsal verimlilik rehberliği** — kısa AI içgörüleri

## Teknik

- `lib/ai.ts` → OpenRouter → Gemma ([[mimari-ai]])
- `lib/aiCache.ts` ile maliyet/gecikme azaltma
- Hata durumunda fallback (uygulama çökmez)

## Açık konular

- AI anahtarının istemci mi backend mi taşındığı doğrulanmalı → [[karar-defteri]]
- Prompt kalitesi/optimizasyonu ölçülmeli → [[sonraki-adimlar]]
