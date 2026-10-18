---
title: Yayın Yol Haritası
type: plan
tags: [flowmind, plan, yayin, appstore]
updated: 2026-10-18
---

# 🚀 Yayın Yol Haritası

İlgili: [[00-FlowMind-MOC]] · [[durum-guncel]] · [[karar-defteri]] · [[yayin-engelleri]] · [[mimari-deployment]]

> Hedef: FlowMind'ı en iyi haline getirip App Store'a almak.
> Önce [[yayin-engelleri]] listesini kapat — oradaki maddeler doğrudan red sebebi.

## ✅ FAZ A — Kod sağlamlaştırma (2026-06-25'te bitti)

1. ✅ AI anahtarı güvenliği → backend proxy (doğrulandı 2026-10-18)
2. ✅ Patch sürüm güncellemesi — ⚠️ 2 paket yeniden geride kaldı: `expo`, `expo-constants`
3. ✅ Supabase bağımlılığı kaldırıldı
4. ✅ `focus.tsx` tutarlılığı gözden geçirildi (değişiklik gerekmedi)
5. ❌ **Gerçek cihaz testi** — `eas build --profile development -p ios` → hâlâ yapılmadı

## 🔴 FAZ B — Mağaza hazırlığı

Sırayla (ilk ikisi red sebebi):

6. **Uygulama içinden hesap silme** (`DELETE /api/auth/account` + profil butonu) → [[yayin-engelleri]] E1
7. **Legal URL'leri yayına al** ve karar ver: backend mi, statik host mu → [[yayin-engelleri]] E2
8. **Store metnini düzelt** — "sesli görev" iddiası gerçek değil → [[yayin-engelleri]] E4
9. **AI modelini üretim için seç** (ücretsiz model kotalı) → [[yayin-engelleri]] E5
10. **Screenshot'lar** — yeni premium UI ile: Today, Tasks, Focus, Stats, Profile.
    iPhone 6.7" (1290×2796) + 6.5" (1284×2778) + Android (1080×1920+).
    Bkz. `.agent/workflows/publish-app.md`
11. **Kök test boru hattını onar** (`jest`, `jest-expo`, `@testing-library/jest-native`
    devDependencies'e) ve CI'a ekle → [[yayin-engelleri]] E6
12. **App Store Connect metadata** — açıklama, anahtar kelimeler, kategori, yaş derecelendirmesi

## 🟢 FAZ C — Build & Submit

13. **Production build** — `eas build --platform ios --profile production`
14. **Submit** — `eas submit --platform ios --profile production`
15. **TestFlight** — önce internal test
16. **Review'a gönder** — Apple incelemesi 1-3 gün

## ⚪ FAZ D — Lansman sonrası

17. **Sentry** bağla (crash/error takibi) → [[arac-mcp]]
18. **MCP temizliği** → [[arac-mcp]]
19. **Log rotasyonu** ve dağıtık rate-limit (bellekteki `Map` yerine) → [[yayin-engelleri]]
20. **İlk geri bildirim → iterasyon**

---

## ⏱️ Kritik yol

```
E1 (hesap silme) → E2 (legal URL) → E3 (backend ayakta) → E5 (model)
   → screenshot (10) → build (13) → submit (14) → review (16)
```
