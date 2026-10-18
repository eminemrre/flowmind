---
title: Yayın Engelleri — App Store Öncesi Zorunlu İşler
type: risk
tags: [flowmind, yayin, appstore, engel, risk]
updated: 2026-10-18
---

# 🚧 Yayın Engelleri

İlgili: [[00-FlowMind-MOC]] · [[sonraki-adimlar]] · [[mimari-deployment]] · [[karar-defteri]]

> **2026-10-18 analizinde** kod tabanı incelenerek çıkarıldı. Sıra = önem sırası.
> Kod iyi durumda; yayını geciktiren şey uygulamanın etrafındaki kabuk.

---

## 🔴 Açık engeller

### E1. Uygulama içinden hesap silme YOK — Apple reddi (kesin)
Apple App Store Review **5.1.1(v)**: hesap oluşturmayı destekleyen uygulamalar,
hesabı **uygulama içinden** silmeye de izin vermek zorundadır. "Destek maili atın"
yeterli değil.

Mevcut durum:
- `app/(tabs)/profile.tsx` → yalnızca çıkış ve profil düzenleme var.
- `backend/routes/auth.js` → `register, login, me, profile, logout`. Silme rotası yok.

Yapılacak:
1. Backend: `DELETE /api/auth/account` (auth korumalı). Şemada `ON DELETE CASCADE`
   tanımlı olduğu için tek `DELETE FROM users WHERE id=$1` görevleri, oturumları,
   enerji kayıtlarını ve rozetleri de temizler.
2. İstemci: profil ekranında "Hesabımı sil" → çift onay → silme sonrası oturumu kapat.
3. Gizlilik politikasındaki silme metni ile uyumlu olduğundan emin ol
   (`backend/legal-content.js` bölüm 6, 7 gün).

### E2. Legal URL'ler public değil
App Store, gizlilik politikası için **çalışan bir URL** ister. Şu an:
- Sayfalar backend'den servis ediliyor (`/privacy`, `/terms`, `/support`) ama
  [[mimari-deployment]] → backend erişilemez durumda.
- `flowmind.app` domaini DNS'te **çözülmüyor** (satın alınmamış, placeholder).
- `app.json`'da hiçbir legal URL tanımlı değil.

Karar gerekiyor: sayfalar backend'den mi servis edilecek, yoksa `web/*.html`
statik kopyaları ücretsiz/stabil bir host'ta (GitHub Pages) mı yayınlanacak?
Backend çökerse politika URL'i de ölür — bu mağaza incelemesi için risktir.

### E3. Backend erişilemez
`217.60.254.141` (legal metinde yazan adres) hem 443 hem 3000 portunda **timeout**
veriyor. Sunucu kapanmış, IP değişmiş veya firewall'lı olabilir. Uygulama API'siz
çalışmaz; önce bunun teyit edilmesi gerek.

### E4. Mağaza metni "sesli görev" diyor, mikrofon yok
`docs/store-description.md` ve `README.md` "voice-to-task / sesli görev" özelliğini
duyuruyor. Gerçekte `components/VoiceTaskButton.tsx` bir **mikrofon ikonu** gösterip
**metin kutusu** açıyor; konuşma tanıma yok, mikrofon izni istenmiyor.
→ Apple "metadata yanıltıcı" gerekçesiyle reddedebilir. İki seçenek: gerçek ses
girişi ekle ya da metni "doğal dille görev ekleme" olarak düzelt.

### E5. Üretimde ücretsiz AI modeli
`OPENROUTER_MODEL=google/gemma-3-4b-it:free`. Ücretsiz tier sıkı kota/rate-limitli;
Apple incelemesi sırasında AI hata verirse "çalışmayan özellik" reddi gelir.
Ücretli/kotalı bir modele geçilmesi önerilir.

### E6. Kök test boru hattı ölü
`package.json` → `"test": "jest"` ama `jest`, `jest-expo` ve
`@testing-library/jest-native` **devDependencies'te yok** → `sh: jest: command not found`.
Yani `__tests__/` altındaki 16 test bloğu hiç çalışmıyor. CI yalnızca backend
testlerini ve `tsc`'yi koştuğu için fark edilmemiş.

### E7. Deployment hikâyesi üç ayrı yeri gösteriyor
| Kaynak | Söylediği |
|---|---|
| `.github/workflows/ci.yml` | `cd /opt/flowmind/backend` + `pm2 restart flowmind-api` |
| `backend/setup-vds.sh` | `/var/www/flowmind` dizini |
| Eski gizlilik metni | "Dokploy ile yönetilir" (artık metinden çıkarıldı) |

Üstelik `setup-vds.sh` yanlış repoyu klonluyordu (`eminemre35/flowmind`) ve
**sabit veritabanı parolası** içeriyordu. İkisi de 2026-10-18'de düzeltildi;
ama hangi yolun gerçek olduğu hâlâ teyit edilmeli.

---

## ✅ 2026-10-18'de kapatılanlar

- **Gizlilik politikası AI'ı inkâr ediyordu** → AI/OpenRouter beyanı yazıldı
  (ne gönderiliyor, ne gönderilmiyor, OpenRouter veri politikası uyarısı). [[ozellik-ai-oneriler]]
- **`/terms` rotası gizlilik politikasını servis ediyordu** → gerçek kullanım
  koşulları yazıldı (Apple asgari lisans koşulları dâhil).
- **İki çelişkili politika** (`web/*.html` vs backend) → tek kaynak:
  `backend/legal-content.js`; `web/*.html` artık `npm run legal:sync` ile üretiliyor,
  `npm run legal:check` ayrışmayı CI'da yakalar.
- **Legal metinden sunucu IP'si ve "Dokploy" çelişkisi** çıkarıldı.
- **README** `EXPO_PUBLIC_OPENROUTER_API_KEY` istiyordu (Faz A'da kaldırılmıştı) → düzeltildi.
- **`docker-compose.yml`** `OPENROUTER_API_KEY`'i container'a geçirmiyordu → eklendi.
- **`setup-vds.sh`** yanlış repo + sabit parola → düzeltildi.

---

## ⚠️ Yayın sonrası (engel değil)

- Sunucu log'ları sınırsız büyüyor (`winston` File transport'ta `maxsize` yok).
- Rate-limit bellekte (`Map`) — restart'ta sıfırlanır, çoklu instance'a uygun değil.
- Sentry henüz bağlı değil → [[arac-mcp]]
