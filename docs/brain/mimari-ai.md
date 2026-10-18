---
title: Mimari — AI Katmanı
type: mimari
tags: [flowmind, mimari, ai]
updated: 2026-10-18
---

# 🤖 AI Katmanı — Backend Proxy → OpenRouter → Gemma

İlgili: [[mimari-genel]] · [[ozellik-ai-oneriler]] · [[mimari-backend]] · [[yayin-engelleri]]

## Akış (2026-06-25'ten beri)

```
UI → lib/ai.ts → (aiCache kontrol; 15 dk / 1 saat TTL) → lib/api.ts
   → POST /api/ai/chat  (JWT korumalı, backend)
   → backend/routes/ai.js → OpenRouter → Gemma
```

**OpenRouter anahtarı yalnız sunucuda** (`OPENROUTER_API_KEY`). İstemcide anahtar
yok; eski `EXPO_PUBLIC_OPENROUTER_API_KEY` tamamen kaldırıldı. Uygulama paketi
tersine mühendislikle açılsa bile anahtar çıkmaz.

## Bileşenler

| Dosya | İş |
|---|---|
| `lib/ai.ts` | Prompt'lar, cache, fallback (`getDailyInsight`, `getWeeklyReport`, `getTaskAnalysis`, `getSmartSchedule`, `getMotivation`, `parseVoiceToTask`) |
| `lib/aiCache.ts` | AsyncStorage tabanlı yanıt önbelleği |
| `backend/routes/ai.js` | Tek proxy rotası; `OPENROUTER_MODEL` ile model seçilir |
| `lib/api.ts` → `aiChat()` | İstemci tarafı çağrı |

## Hata davranışı

Anahtar yoksa proxy `503` döner; OpenRouter hata verirse `502`. İki durumda da
`lib/ai.ts` statik bir fallback metni döndürür — uygulama çökmez, AI dışındaki
tüm özellikler çalışmaya devam eder.

## Riskler

- **Model `google/gemma-3-4b-it:free`** — ücretsiz tier kotalı. Apple incelemesi
  sırasında AI'ın çalışmaması "bozuk özellik" reddine yol açabilir → [[yayin-engelleri]] E5
- **Gizlilik beyanı** — görev metni ve enerji verisi OpenRouter'a gidiyor.
  Bu 2026-10-18'de gizlilik politikasına yazıldı (`backend/legal-content.js` bölüm 4).
  AI'ın kapsamı değişirse metin de güncellenmeli.
