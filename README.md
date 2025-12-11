# Yeniproje — Yapay Görsel Oluşturucu Demo

Bu depo, seçilen fiziksel özelliklere göre yapay insan görselleri üretmeye yönelik ürün fikrinin statik bir demo arayüzünü içerir. Demo, gerçek model çalıştırmaz; yerine sentetik placeholder görseller ve örnek API yanıtı gösterir.

## Başlarken
1. Node 18+ yüklü olduğundan emin olun.
2. Depo klasöründe `npm start` komutunu çalıştırın (yerleşik statik sunucu `http://localhost:8000` adresinde açılır).
3. Tarayıcıdan `http://localhost:8000` adresini açın.
4. Özellikleri seçip **Oluştur** butonuna basın veya **Rastgele Karıştır** ile hızlı denemeler yapın.

## Özellikler
- Saç rengi, ten tonu (Fitzpatrick), cinsiyet seçeneği, boy, yaş aralığı, giyim stili (çoklu), poz ve arka plan dahil kontrollü vocab listeleri.
- Seed girişi ve çıktı boyutu seçimi; giyim stili için maksimum 2 seçim kuralı.
- "Bu resim yapay olarak üretilmiştir" uyarıları, watermark ve meta kutusu.
- Mock API yanıtını JSON formatında kopyalama ve önizleme görselini PNG olarak indirme.

## Güvenlik ve etik notları
- Demo gerçek kişi fotoğrafı üretmez veya yüklenmesini istemez.
- Ünlü/özel kişi veya yasaklı içerik isteklerini reddetmek için whitelist doğrulama ve politika mesajları arayüzde belirtilmiştir.

## Lisans
Tüm içerik yalnızca demo amaçlıdır.
