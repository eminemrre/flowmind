---
title: Yayın Yol Haritası
type: plan
tags: [flowmind, plan, yayin, appstore]
updated: 2026-06-25
---

# 🚀 Yayın Yol Haritası

İlgili: [[00-FlowMind-MOC]] · [[durum-guncel]] · [[karar-defteri]] · [[mimari-deployment]]

> Hedef: FlowMind'ı **en iyi haline getirip App Store'a** almak.
> Sıra önemli — A bitmeden C'ye geçme.

## ✅ Tamamlandı (2026-06-25)

- Premium cybermorphism UI → tüm tab ekranları ([[durum-guncel]])
- Yeni App Store ikonu: **Girdap Küre** (icon/adaptive/splash/favicon)
- `tsc --noEmit` temiz, Expo Metro temiz başlıyor
- Eskimiş ROADMAP/README düzeltildi

---

## 🔴 FAZ A — Kod sağlamlaştırma (YAYINDAN ÖNCE ŞART)

1. **AI anahtarı güvenliği** — `EXPO_PUBLIC_OPENROUTER_API_KEY` binary'e gömülüyor,
   ifşa riski. `lib/ai.ts` çağrılarını backend proxy'ye taşı (`POST /ai/insight`),
   anahtar yalnız sunucuda kalsın. → [[mimari-ai]] · [[karar-defteri]]
   **Bu çözülmeden mağazaya çıkma.**
2. **Patch sürümleri güncelle** — `npx expo install expo expo-font expo-router`
3. **Supabase netleştir** — kullanılmıyorsa `npm rm @supabase/supabase-js` → [[karar-defteri]]
4. **focus.tsx tutarlılık** — kullanıcının redesign'ı diğer ekranlarla aynı dilde mi? Gözden geçir → [[ozellik-enerji-ve-odak]]
5. **Gerçek cihaz testi** — `eas build --profile development -p ios` → telefona kur →
   login akışı dahil tüm akış çalışıyor mu (Expo Go secure-store'u tam desteklemez) → [[mimari-deployment]]

## 🟡 FAZ B — Mağaza hazırlığı

6. **Screenshot'lar** (App Store şartı) — yeni premium UI ile: Today, Tasks, Focus,
   Stats, Profile. iPhone 6.7" (1290×2796) + 6.5" + Android. Bkz. `.agent/workflows/publish-app.md`
7. **Store metni** — `docs/store-description.md` güncel mi (yeni özellikler/UI)?
8. **Legal URL'leri** — `/privacy /terms /support` public host'ta erişilebilir mi doğrula → [[mimari-backend]]
9. **App Store Connect metadata** — açıklama, anahtar kelimeler, kategori, yaş derecelendirme

## 🟢 FAZ C — Build & Submit

10. **Production build** — `eas build --platform ios --profile production` (buildNumber autoIncrement)
11. **Submit** — `eas submit --platform ios --profile production` → App Store Connect
12. **TestFlight** — önce internal test (kendin + birkaç kişi), kritik bug yoksa
13. **Review'a gönder** — Apple inceleme 1-3 gün; ilk red olağan, geri bildirimi uygula

## ⚪ FAZ D — Lansman sonrası

14. **Sentry** bağla (crash/error takibi) → [[arac-mcp]]
15. **MCP temizliği** — gürültüyü azalt → [[arac-mcp]]
16. **İlk geri bildirim → iterasyon** — analytics, kullanıcı yorumları

---

## ⏱️ Kritik yol (en kısa yayın)

```
A1 (AI key) → A5 (cihaz testi) → B6 (screenshot) → C10 (build) → C11 (submit) → C13 (review)
```
A1 en riskli ve en önemli. Diğer A maddeleri paralel ilerleyebilir.
