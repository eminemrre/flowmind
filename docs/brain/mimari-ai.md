---
title: Mimari — AI Katmanı
type: mimari
tags: [flowmind, mimari, ai]
updated: 2026-06-25
---

# 🤖 AI Katmanı — OpenRouter + Gemma

İlgili: [[mimari-genel]] · [[ozellik-ai-oneriler]] · [[mimari-frontend]]

## Stack

- **OpenRouter** AI gateway (`lib/ai.ts`)
- **Gemma-class** modeller (yapılandırılabilir) — git: "model to Google Gemma 3"
- **AI cache** (`lib/aiCache.ts`) — Faz 6.5'te eklendi, tekrar istekleri azaltır
- **Fallback** mekanizması — API hatalarında çökmesin

## Sorumluluklar

- Günlük AI öneri / plan üretimi → [[ozellik-ai-oneriler]]
- Enerji bazlı görev planlama girdisi → [[ozellik-enerji-ve-odak]]
- Sesli görev (voice-to-task) yorumlama → [[ozellik-ai-oneriler]]

## Akış

```
UI → lib/ai.ts → (aiCache kontrol) → OpenRouter → Gemma
                      │ cache hit
                      └────────────► hızlı dönüş
```

## Notlar / Riskler

- Model anahtarı `.env`'de — istemci tarafında AI çağrısı yapılıyorsa anahtar
  ifşa riski; ideali backend proxy üzerinden. Bkz. [[karar-defteri]].
- Prompt optimizasyonu ROADMAP'te vardı — durumu doğrulanmalı → [[sonraki-adimlar]]
