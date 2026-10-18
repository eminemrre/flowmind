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

### E1. ✅ Kapatıldı — uygulama içinden hesap silme (2026-10-18)
Apple App Store Review **5.1.1(v)** gereği eklendi:
- `backend/routes/auth.js` → `DELETE /api/auth/account` (auth korumalı, parola onaylı)
- `components/DeleteAccountModal.tsx` → geri alınamazlık uyarısı, silinecek veri listesi,
  parola alanı, satır içi hata
- `stores/authStore.deleteAccount()` → sunucu silme + oturum anahtarı, çevrimdışı
  görev önbelleği ve bekleyen işlem kuyruğunu temizler
- `lib/api.ts` → `deleteAccount(password)`
- Profil ekranına "Hesap → Hesabımı Sil" satırı eklendi

Doğrulama: token yok → 401, geçersiz token → 401, parola yok → 400, yanlış parola → 401.
Cascade davranışı gerçek Postgres motorunda (PGlite) test edildi: `DELETE FROM users`
görevleri, odak oturumlarını, enerji kayıtlarını, başarımları ve tercihleri siliyor.
`backend/__tests__/auth.test.js` bu akışın tamamını kalıcı olarak kapsıyor.
Hukuki metinler de güncellendi (Gizlilik bölüm 6 + Destek SSS).

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

### E6. Test boru hattı ölü, CI aylardır kırmızı
İki ayrı kırık nokta var:

1. **Kök (istemci) testleri çalışmıyor.** `package.json` → `"test": "jest"` ama
   `jest`, `jest-expo` ve `@testing-library/jest-native` **devDependencies'te yok**
   → `sh: jest: command not found`. `__tests__/` altındaki 16 test bloğu hiç koşmuyor.

2. **Backend testleri hiç geçmiyordu.** `backend/__tests__/*.test.js` rotaları
   `/auth/...`, `/tasks/...` diye çağırıyordu; oysa `server.js` hepsini `/api`
   ön ekiyle bağlar → **her istek 404 dönüyordu.** `achievements.test.js` ayrıca
   var olmayan `/achievements/my` rotasını ve şemada bulunmayan
   `user_achievements` tablosunu kullanıyordu.

   Sonuç: `gh run list` → **son 12 CI koşusunun tamamı `failure`** (Mayıs'tan beri).
   `frontend-lint` (tsc) geçiyor, kırmızı olan tek adım backend testleri.

   ✅ 2026-10-18: yollar `/api/...` olarak düzeltildi, `/achievements/my` testi
   gerçek rotalarla (`GET /`, `POST /check`) değiştirildi, `first_task` kazanımı ve
   cascade kapsamı eklendi. Yerel postgres olmadığı için bu düzeltmenin CI'da
   yeşile dönmesi doğrulanmadı.

3. **`npm run lint` de ölü.** `"lint": "eslint ."` tanımlı ama `eslint`
   devDependencies'te yok ve repoda hiç eslint yapılandırma dosyası **yok**
   (`.eslintrc*` veya `eslint.config.*`). Aynı kök sebep: istemci tarafındaki
   geliştirme araçları `package.json`'a hiç yazılmamış.

> Test sınırı notu: `/api/auth` için IP başına 15 dakikada 10 istek sınırı vardı;
> suite büyüdükçe testler 429 alabilir. Sınırlar artık `RATE_LIMIT_MAX` ve
> `AUTH_RATE_LIMIT_MAX` ortam değişkenleriyle ayarlanabiliyor (üretim varsayılanı
> değişmedi, CI'da yükseltildi).

### E7. Deployment hikâyesi üç ayrı yeri gösteriyor
| Kaynak | Söylediği |
|---|---|
| `.github/workflows/ci.yml` | `cd /opt/flowmind/backend` + `pm2 restart flowmind-api` |
| `backend/setup-vds.sh` | `/var/www/flowmind` dizini |
| Eski gizlilik metni | "Dokploy ile yönetilir" (artık metinden çıkarıldı) |

Üstelik `setup-vds.sh` yanlış repoyu klonluyordu (`eminemre35/flowmind`) ve
**sabit veritabanı parolası** içeriyordu. İkisi de 2026-10-18'de düzeltildi;
ama hangi yolun gerçek olduğu hâlâ teyit edilmeli.

### E8. Placeholder/ölü butonlar (Apple 2.1 App Completeness riski)
`app/(tabs)/profile.tsx` içinde çalışmayan öğeler var — Apple incelemesi bunlara
dokunursa "uygulama tamamlanmamış" reddi gelebilir:
- Bildirim ve Ses Efektleri anahtarları **hiçbir şeye bağlı değil** (yalnız yerel state)
- "Görünüm" → "Yakında eklenecek" uyarısı
- "Yardım Merkezi", "Bizi Değerlendirin", "Gizlilik Politikası" satırlarının
  `onPress`'i **yok** — dokunulunca hiçbir şey olmuyor
- Avatar üzerindeki kamera butonu işlevsiz
- Sürüm metni sabit: `v1.0.0 (Build 2026.02)`

> Not: "Gizlilik Politikası" satırı E2 çözülünce bir URL'e bağlanmalı; Apple
> uygulama içinden politika erişimi bekler.

---

## ✅ 2026-10-18'de kapatılanlar

- **E1 — uygulama içinden hesap silme yoktu** (Apple 5.1.1(v)) → `DELETE /api/auth/account`,
  `DeleteAccountModal`, store aksiyonu ve testler eklendi. Ayrıntı: yukarıdaki E1.
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
- **Backend testlerindeki `/api` ön eki** düzeltildi (CI'nın kırmızı kalma sebebi) → E6.
- **CI'a iki koruma eklendi:** `legal:check` (metin ayrışması) ve API anahtarı taraması.

---

## ⚠️ Yayın sonrası (engel değil)

- Sunucu log'ları sınırsız büyüyor (`winston` File transport'ta `maxsize` yok).
- Rate-limit bellekte (`Map`) — restart'ta sıfırlanır, çoklu instance'a uygun değil.
- Sentry henüz bağlı değil → [[arac-mcp]]
