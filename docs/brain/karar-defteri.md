---
title: Karar Defteri & Alınan Kararlar
type: karar
tags: [flowmind, karar, adr]
updated: 2026-10-18
---

# 🧭 Karar Defteri

İlgili: [[00-FlowMind-MOC]] · [[mimari-genel]] · [[sonraki-adimlar]] · [[yayin-engelleri]]

## ✅ Alınmış kararlar

- **Ana backend = VDS Express + PostgreSQL** (Supabase değil) → [[mimari-backend]]
  - 2026-06-25: kullanılmayan `@supabase/supabase-js` bağımlılığı kaldırıldı. Çelişki kapandı.
- **AI = OpenRouter + Gemma** (maliyet/esneklik) → [[mimari-ai]]
  - Varsayılan model `google/gemma-3-4b-it:free`; üretim için değiştirilmesi öneriliyor → [[yayin-engelleri]] E5.
- **State = Zustand** (Redux yerine, hafiflik) → [[mimari-state-zustand]]
- **Build = EAS Cloud** (iOS build için Mac gerekmesin) → [[mimari-deployment]]
- **Recurring tasks** MVP dışı bırakıldı → Faz 9'da geri alındı → [[ozellik-gorev-yonetimi]]
- **Expo SDK 52 → 54** yükseltmesi yapıldı → [[gelisim-fazlari]]
- **AI anahtarı istemciden çıkarıldı** (2026-06-25, Faz A): `/api/ai/chat` proxy'si
  `auth` korumalı; anahtar yalnız sunucuda `OPENROUTER_API_KEY` olarak durur.
  `EXPO_PUBLIC_` önekli her değişken uygulama paketine gömüldüğü için AI anahtarı
  asla bu önekle verilmemeli. → [[mimari-ai]]
- **Hukuki metinlerin tek kaynağı `backend/legal-content.js`** (2026-10-18).
  `web/*.html` artık buradan üretilen kopyalardır; `npm run legal:check` CI'da
  ayrışmayı yakalar. Sebep: iki kopya birbirinden ayrışmıştı ve canlı sayfa
  gerçeği yansıtmıyordu. → [[yayin-engelleri]]

## 🔧 Çözülen eski çelişkiler

| Çelişki | Durum |
|---|---|
| `ROADMAP.md` gerçeği yansıtmıyordu | 2026-06-25'te güncellendi, `docs/brain`'e yönlendiriyor |
| `README.md` sürümleri eskiydi (SDK 52 / RN 0.76) | Düzeltildi → SDK 54 / RN 0.81 |
| Supabase mi Express mi? | Supabase kaldırıldı; Express tek backend |
| AI anahtarı istemcide mi? | Sunucuya taşındı (Faz A) |
| İki farklı gizlilik politikası | Tek kaynağa indirildi (2026-10-18) |
| `/terms` gizlilik politikası gösteriyordu | Gerçek kullanım koşulları yazıldı (2026-10-18) |

## ⚠️ Karar bekleyenler

1. **Legal sayfalar nerede yayınlanacak?** Backend mi, statik host (GitHub Pages) mu?
   Backend çökerse politika URL'i ölür → mağaza riski. → [[yayin-engelleri]] E2
2. **AI modeli üretimde ne olacak?** Ücretsiz model kotalı; ücretli modele geçiş
   maliyet ve kalite kararı. → [[yayin-engelleri]] E5
3. **"Sesli görev" gerçekten sesli olacak mı?** Gerçek konuşma tanıma eklenmesi
   (expo-av / speech API + mikrofon izni + gizlilik metni güncellemesi) ya da
   özelliğin adının/metninin düzeltilmesi. → [[yayin-engelleri]] E4
4. **Deployment tek yol olacak mı?** PM2 mi, Dokploy mu, Docker mı?
   Üç ayrı yer farklı şey söylüyor. → [[yayin-engelleri]] E7
