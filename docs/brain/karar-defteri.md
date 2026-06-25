---
title: Karar Defteri & Çözülmemiş Çelişkiler
type: karar
tags: [flowmind, karar, adr, risk]
updated: 2026-06-25
---

# 🧭 Karar Defteri & Çelişkiler

İlgili: [[00-FlowMind-MOC]] · [[mimari-genel]] · [[sonraki-adimlar]]

## ⚠️ Çözülmemiş çelişkiler (önce bunlar)

### 1. `ROADMAP.md` gerçeği yansıtmıyor
"Faz 2 → %0" diyor ama git history **Faz 10 + App Store hazırlığı** bitmiş.
→ Doküman ölü. **Aksiyon:** güncelle veya `docs/brain`'e yönlendir. [[sonraki-adimlar]]

### 2. `README.md` sürümleri eski
"React Native 0.76 / Expo SDK 52" yazıyor; gerçek **0.81 / SDK 54** (git: "upgrade to SDK 54").
**Aksiyon:** README rozetlerini güncelle.

### 3. Supabase mı, Express mi? (çift backend riski)
`@supabase/supabase-js` bağımlılıkta var ama `lib/api.ts` tamamen **VDS Express**
client'ı. Kod tabanında Supabase aktif kullanımı bulunamadı.
→ **[Olası] ölü bağımlılık.** Doğrula; kullanılmıyorsa `npm rm @supabase/supabase-js`.

### 4. AI anahtarı nerede?
`lib/ai.ts` istemci tarafında OpenRouter çağırıyorsa, anahtar APK/IPA içinde
ifşa olur. **Aksiyon:** AI çağrılarını backend proxy'ye taşımayı değerlendir → [[mimari-ai]]

## ✅ Alınmış kararlar

- **Ana backend = VDS Express + PostgreSQL** (Supabase değil) → [[mimari-backend]]
- **AI = OpenRouter + Gemma** (maliyet/esneklik) → [[mimari-ai]]
- **State = Zustand** (Redux yerine, hafiflik) → [[mimari-state-zustand]]
- **Build = EAS Cloud** (Windows'ta iOS build için Mac gerekmesin) → [[mimari-deployment]]
- **Recurring tasks** MVP dışı bırakıldı → Faz 9'da geri alındı → [[ozellik-gorev-yonetimi]]
- **Expo SDK 52 → 54** yükseltmesi yapıldı → [[gelisim-fazlari]]
