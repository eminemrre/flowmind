---
description: FlowMind uygulamasını App Store ve Google Play'de yayınlama adımları
---

# 📱 FlowMind — App Store & Google Play Yayınlama Rehberi

## 🔴 ÖNEMLİ: Önce Hesap Aç (Bu Olmadan Hiçbir Şey Yapılamaz)

### Apple App Store
1. **https://developer.apple.com** adresine git
2. **Apple ID** ile giriş yap (yoksa oluştur)
3. **Apple Developer Program**'a katıl → **99$/yıl** (₺3.200 civarı)
4. Ödeme yaptıktan sonra **24-48 saat** onay süresi var
5. **Mac bilgisayar gerekli** (Windows'ta iOS build yapılamaz — ama EAS Cloud Build ile Mac'e gerek kalmıyor!)

### Google Play Store
1. **https://play.google.com/console** adresine git
2. **Google hesabı** ile giriş yap
3. **Geliştirici hesabı** oluştur → **25$ tek seferlik** (₺850 civarı)
4. Kimlik doğrulama gerekebilir (birkaç gün sürebilir)

---

## 📋 Adım Adım Süreç

### Adım 1: EAS CLI Kurulumu
// turbo
```bash
npm install -g eas-cli
```

### Adım 2: Expo Hesabına Giriş
```bash
eas login
```
- **https://expo.dev** adresinden ücretsiz hesap oluştur
- E-posta ve şifre ile giriş yap

### Adım 3: Expo Projesini Bağla
```bash
cd /home/emin/flowmind
eas init
```
- Bu komut `app.json` içindeki `projectId` alanını otomatik dolduracak

### Adım 4: app.json Kontrolü
`app.json` içinde şunların doğru olduğundan emin ol:
- `name`: "FlowMind" ✅
- `slug`: "flowmind" ✅
- `version`: "1.0.0" ✅
- `ios.bundleIdentifier`: "com.flowmind.app" ✅
- `android.package`: "com.flowmind.app" ✅

### Adım 5: Android Build (APK/AAB)
```bash
eas build --platform android --profile production
```
- İlk seferinde **keystore** otomatik oluşturulur
- Build **EAS Cloud**'da yapılır (bilgisayarında bir şey yüklemeye gerek yok)
- **10-20 dakika** sürer
- Bitince indirme linki verilir

### Adım 6: iOS Build (IPA)
```bash
eas build --platform ios --profile production
```
- İlk seferinde **Apple Developer bilgilerini** soracak:
  - Apple ID
  - Apple Developer Team ID
  - Bundle Identifier
- Sertifikalar otomatik oluşturulur
- Build **EAS Cloud**'da yapılır (Mac'e gerek yok!)
- **15-30 dakika** sürer

### Adım 7: Google Play'e Yükleme

#### Manuel Yükleme:
1. **https://play.google.com/console** → Uygulama oluştur
2. Uygulama adı: "FlowMind AI"
3. "Dahili test" kanalına git
4. EAS'tan indirdiğin **.aab** dosyasını yükle
5. _Store listing_ (mağaza bilgileri) doldur:
   - Başlık, açıklama → `docs/store-description.md`'den kopyala
   - Screenshots (en az 2 adet, telefon ekran görüntüsü)
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Gizlilik politikası URL'i
6. İçerik derecelendirme anketini doldur
7. Hedefe göre dağıtım ülkelerini seç
8. "Yayınla" butonuna bas

#### Otomatik Yükleme (Opsiyonel):
```bash
eas submit --platform android --profile production
```

### Adım 8: App Store'a Yükleme

#### Manuel Yükleme:
1. **https://appstoreconnect.apple.com** → Yeni uygulama
2. Bundle ID: com.flowmind.app
3. Uygulama bilgilerini doldur:
   - Başlık, açıklama → `docs/store-description.md`'den kopyala
   - Screenshots (en az 3 adet, farklı iPhone boyutları)
   - Gizlilik politikası URL'i
   - Yaş derecelendirmesi
   - İletişim bilgileri
4. EAS'tan indirdiğin **.ipa** dosyasını **Transporter** uygulamasıyla yükle
5. Build'i seç → "Submit for Review" butonuna bas
6. **Apple inceleme süreci: 1-3 gün** (bazen 1 hafta)

#### Otomatik Yükleme:
```bash
eas submit --platform ios --profile production
```

---

## 📸 Screenshots Hazırlama

App Store ve Google Play için **ekran görüntüleri** şart:

### Gereken Boyutlar:
| Platform | Boyut | Adet |
|----------|-------|------|
| iPhone 6.7" | 1290 x 2796 | En az 3 |
| iPhone 6.5" | 1284 x 2778 | En az 3 |
| iPad 12.9" | 2048 x 2732 | Opsiyonel |
| Android | 1080 x 1920+ | En az 2 |

### Nasıl Alınır:
1. `npx expo start` ile uygulamayı çalıştır
2. iOS Simulator veya Android Emulator'da aç
3. Her ekrandan screenshot al (Today, Tasks, Focus, Stats, Profile)
4. **Mockup araçları** kullan: https://screenshots.pro veya https://previewed.app

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Gizlilik politikası URL'i** şart — `web/privacy-policy.html` dosyasını bir yere host etmen lazım (GitHub Pages, Netlify, vs.)
2. **App değerlendirme anketi** — "Bu uygulama kullanıcıdan veri topluyor mu?" → Evet (e-posta, görev bilgileri)
3. **İlk submission** genellikle reddedilir — Apple çok titizdir, geri bildirimi oku ve düzelt
4. **Test sürümü** önce yayınla — "Internal Testing" ile kendin test et

---

## 💰 Toplam Maliyet

| Kalem | Ücret |
|-------|-------|
| Apple Developer | 99$/yıl |
| Google Play | 25$ (tek seferlik) |
| EAS Build (Free tier) | Ücretsiz (aylık 30 build) |
| **Toplam başlangıç** | **~124$** |

---

## 🚀 Hızlı Başlangıç Sırası

```
1. Apple Developer + Google Play hesaplarını aç
2. npm install -g eas-cli && eas login
3. eas init (proje bağlama)
4. eas build --platform android --profile production
5. Google Play Console'a .aab yükle
6. eas build --platform ios --profile production  
7. App Store Connect'e .ipa yükle
8. İncelemeye gönder → Bekle → Yayında! 🎉
```
