# Rastgele İnsan Görüntüsü Oluşturucu — Ürün ve Prototip Spesifikasyonu

## 1) Ürün Özeti ve Kapsam
- **Amaç:** Kullanıcıların seçtikleri fiziksel özelliklere göre yapay ve fotogerçekçi insan görselleri üretmek; araştırma, tasarım konsepti, persona/ilham ve demo kullanımlarını desteklemek.
- **Hedef Kullanıcılar:** UX/UI tasarımcıları, ürün ekipleri, pazarlama/prototipleme ekipleri, araştırmacılar.
- **İzin Verilen Kullanımlar:** Persona görselleştirme, konsept/prototip sunumları, kreatif ilham, arayüz örnekleri. Üretilen görsellerin yapay olduğunu belirten açıklamalar şarttır.
- **Yasaklı Kullanımlar:** Kimlik sahteciliği/deepfake, taciz/nefret, siyasi manipülasyon, dolandırıcılık, sahte kimlik doğrulama, yetişkin/içerik politikalarını ihlal eden senaryolar, özel kişileri taklit etme veya hedefleme.
- **Uyumluluk ve Politika:** Çıktılar gerçek kişileri temsil etmez; yaş hassasiyeti (yalnızca yaş aralığı), yüz tanıma veya yeniden tanımlama yapılmaz. Üretim loglarında kişisel veri saklanmaz. Açıkça “synthetic/üretildi” işaretleri ve görünür uyarılar sağlanır.

## 2) Özellik Taksonomisi ve Kontrol Listesi
| Özellik | Zorunlu? | Kontrol Vokabüleri / Aralıklar | Model Girdisi | Doğrulama Kuralları |
| --- | --- | --- | --- | --- |
| Saç Rengi | Opsiyonel | black, brown, blond, red, gray, white, dyed-multi | `hair_color` | İzinli listeden bir değer, 1 seçim |
| Ten Tonu | Opsiyonel | Fitzpatrick I–VI (1–6) | `skin_tone` (1-6) | Tam sayı 1-6 |
| Boy Kategorisi | Opsiyonel | short, average, tall | `height_cat` | Tek değer |
| Yaş Aralığı | Opsiyonel | teen(13-19), young-adult(20-35), adult(36-55), senior(56+) | `age_bucket` | Tek değer; 13 yaş altı yok |
| Cinsiyet Opsiyonu | Opsiyonel | female, male, non-binary, unspecified | `gender` | Tek değer |
| Vücut Yapısı | Opsiyonel | slim, average, athletic, curvy, plus | `body_type` | Tek değer |
| Ayakkabı Numarası | Opsiyonel | 34-36, 37-39, 40-42, 43-45, 46+ | `shoe_size_range` | Tek değer |
| Giyim Stili | Opsiyonel | casual, formal, sporty, streetwear, business-casual, traditional | `clothing_style` | Çoklu seçim 1-2 |
| Poz | Opsiyonel | front-facing, 3/4 view, profile-left, profile-right, seated, walking | `pose` | Tek değer |
| Arka Plan | Opsiyonel | plain, studio-soft, outdoor-day, indoor-office, abstract | `background` | Tek değer |
| Çeşitlilik/Tesadüf | Otomatik | seed veya `randomize` flag | `seed` | Varsayılan rastgele seed |

> Tüm alanlar opsiyonel; boş bırakılırsa model çeşitlendirilmiş rastgele örnek üretir. Çoklu seçim izinli alanlarda maksimum 2 değer kuralı uygulanır.

## 3) UX Akışları ve Wireframe Açıklamaları
- **Landing/Page Hero:**
  - Başlık: “Yapay olarak üretilen fotogerçekçi insan görselleri”
  - Açıklama: “Seçtiğiniz özelliklere göre rastgele, gerçek kişi olmayan görseller oluşturun.”
  - CTA buton: “Hemen Başla”
  - Güvenlik notu (Turkish): “Bu resim yapay olarak üretilmiştir; gerçek bir kişiyi temsil etmez.”

- **Özellik Seçim Alanı (Filter panel + kart grid):**
  - Çoklu select/checkbox: saç rengi, ten tonu (Fitzpatrick 1-6), cinsiyet, boy, yaş aralığı.
  - Dropdown: giyim, poz, arka plan.
  - Slider veya buton grubu: “Çeşitlendir” (seed şıkkı), “Rastgele Karıştır”.
  - Label örnekleri:
    - “Saç Rengi” (dropdown): seçenekler English, alt metin: “Lütfen listeden seçiniz”.
    - “Yaş Aralığı”: “Genç Yetişkin (20-35)” vb.
    - Uyarı: “Gerçek kişi fotoğrafı yüklenmez veya üretilmez.”

- **Önizleme/Sonuç Sayfası:**
  - Görsel kartı + watermark/overlay: “SYNTHETIC / ÜRETİLMİŞ”.
  - Açıklama altı: “Bu görsel rastgele bir yapay üretimdir; kimseyi temsil etmez.”
  - Butonlar (Turkish):
    - “Tekrar Oluştur” (shuffle)
    - “Farklı Rastgele”
    - “İndir (JPG)”
    - “Paylaş (link)”
  - Metadata chip’leri: seçilen özelliklerin okunabilir metni.

- **Kaydet/İndir:**
  - İndirme öncesi onay mesajı: “Bu görsel yapay olarak üretilmiştir; ticari kullanım lisansını kontrol ediniz.”
  - Dosya meta/EXIF’e `SyntheticImage=true`, `Model=...`, `GeneratedAt=...` gibi alanlar eklenir.

- **Uyarılar ve Rıza Metni (ekran altı banner):**
  - “Bu servis gerçek kişilerin fotoğraflarını üretmez. Hedefli, zararlı veya yanıltıcı kullanım yasaktır.”

- **Hata/Mesaj örnekleri (Turkish):**
  - “Geçersiz özellik değeri. Lütfen listeden seçim yapın.”
  - “İstek sınırını aştınız. Daha sonra tekrar deneyin.”
  - “Güvenlik filtresi üretimi engelledi. Lütfen daha genel bir istek deneyin.”

## 4) Görüntü Üretim Yaklaşımı
- **Model Seçenekleri:**
  - Diffusion modelleri (öneri: Stable Diffusion v1.5/XL türevleri, ControlNet/LoRA ile attribute conditioning).
  - GAN tabanlı çözümler (StyleGAN3) — ancak diffusion daha esnek.
  - **Kurallı/etik veri:** Yalnızca telif hakkı temiz, izinli, sentetik veya lisanslı veri kullanımı. Gerçek kişi eşleşmesi yasak.
- **Koşullama:**
  - Metin prompt + negative prompt; attribute->prompt mapping tablosu; ControlNet (pose) + LoRA (giyim/ten tonu) kombinasyonu.
  - Seed rastgeleliği ile çeşitlilik; aynı seed + parametreler deterministik.
- **Sentetik Zorunluluğu:**
  - Eğitim ve inference sırasında yüz embedding’leri veya gerçek kişi fotoğrafları kullanılmaz.
  - Face reconstruction/ID-matching blokları devre dışı; upload yok.
  - Çıktılara görünür watermark ve metadata (`synthetic=true`).
  - Per-request güvenlik filtresi: NSFW, şiddet, nefret, politik figürler, ünlü isimler sözcük listesi/CLIP-safety checker.

## 5) Etik, Güvenlik ve Önyargı Azaltma
- **Engellemeler:** Ünlü isim/özel kişi, hassas kimlik nitelikleri (ırk, din, etnik grup) prompt’tan otomatik temizlenir veya reddedilir.
- **Bias testleri:**
  - Attribute kombinasyonları için dağılım ölçümü (ten tonu, cinsiyet, yaş aralıkları) ve görsel çeşitlilik skoru.
  - Kullanıcı geri bildirim butonu: “Uygunsuz mu? Bildir”.
- **Güvenlik Filtreleri:** NSFW, politik veya şiddetli içerik; çocuk koruması (13 yaş altı üretim yok); cinsellik, nefret sembolleri.
- **Uyarılar:** Her sonuç kartında: “Bu resim yapay olarak üretilmiştir; gerçek bir kişiyi temsil etmez.”

## 6) Mahremiyet & Hukuki Çerçeve
- **İmpersonasyon Önleme:** Kullanıcıdan özgün isim, fotoğraf veya kişiye özgü veriler almama; metin analizinde isim/özel kişi yakalama ve reddetme.
- **Lisans:** Model ve dataset lisanslarının (CreativeML/OpenRAIL veya ticari lisans) uyum kontrolü; çıktı lisansı sayfada belirtilir.
- **Veri Tutma:** Minimal log (timestamp, seçilen özellikler, anonim IP hash, latency). Görseller isteğe bağlı geçici (örn. 24h) saklanır; silme API’si.
- **Rıza Örneği (Turkish):** “Devam ederek yapay görsellerin üretileceğini, gerçek kişileri temsil etmediğini ve kullanım şartlarını kabul ettiğinizi onaylarsınız.”

## 7) Uygulama Detayları
- **Mimari:**
  - Frontend: React/Next.js + TypeScript, i18n (react-intl), SSR/ISR; Tailwind/Chakra.
  - Backend: Node.js (Nest/Fastify) veya Python (FastAPI); GPU inference servisi ayrı (e.g., Triton, Modal, Replicate-like worker).
  - Storage/CDN: S3 compatible + Cloudfront; presigned URL ile indirme.
  - Caching: Attribute listesini CDN cache; son üretilen görseller için 1h CDN caching (no-cache on private if user-specific).
  - Rate Limit: IP tabanlı (örn. 30 istek/sa); Auth kullanıcı bazlı kova; misafirler için düşük limit.
  - Maliyet Kontrol: Küçük çözünürlük önizlemesi, batched inference, queue + autoscaling, günlük bütçe guardrail.

### API Örnekleri
- **GET /api/attributes**
```json
{
  "hair_color": ["black", "brown", "blond", "red", "gray", "white", "dyed-multi"],
  "skin_tone": [1,2,3,4,5,6],
  "height_cat": ["short","average","tall"],
  "age_bucket": ["teen","young-adult","adult","senior"],
  "gender": ["female","male","non-binary","unspecified"],
  "body_type": ["slim","average","athletic","curvy","plus"],
  "shoe_size_range": ["34-36","37-39","40-42","43-45","46+"],
  "clothing_style": ["casual","formal","sporty","streetwear","business-casual","traditional"],
  "pose": ["front-facing","3/4 view","profile-left","profile-right","seated","walking"],
  "background": ["plain","studio-soft","outdoor-day","indoor-office","abstract"]
}
```

- **POST /api/generate**
```json
{
  "attributes": {
    "hair_color": "brown",
    "skin_tone": 4,
    "gender": "female",
    "age_bucket": "young-adult",
    "body_type": "average",
    "clothing_style": ["casual"],
    "pose": "front-facing",
    "background": "studio-soft"
  },
  "seed": 123456,
  "size": "768x768"
}
```
_Response_
```json
{
  "id": "gen_abc123",
  "image_url": "https://cdn.example.com/gen_abc123.jpg",
  "seed": 123456,
  "safety": {"nsfw": false, "policy_blocked": false},
  "attribution": {"synthetic": true, "model": "sdxl-lora-v1"},
  "expires_at": "2024-12-31T00:00:00Z"
}
```

- **POST /api/shuffle** (yeniden rastgele üretim, aynı özelliklerle)
```json
{
  "base_request_id": "gen_abc123",
  "new_seed": "random"
}
```
_Response_
```json
{
  "id": "gen_def456",
  "image_url": "https://cdn.example.com/gen_def456.jpg",
  "seed": 789012
}
```

### Sunucu Tarafı Doğrulama Kuralları
- Tüm attribute değerleri whitelist listelerinde olmalı; boş değerler serbest.
- `age_bucket` zorunlu değil, ancak 13 yaş altı değerler reddedilir.
- Çoklu seçim alanları (örn. `clothing_style`) maksimum 2 değer.
- İsim, yer, ünlü veya hassas sözcük tespitinde istek reddedilir; hata: 400 “İzin verilmeyen içerik”.
- Rate limit aşımlarında 429, güvenlik filtre bloklarında 451.

## 8) Erişilebilirlik & i18n
- **Klavye:** Tüm form kontrolleri Tab sırası; space/enter ile toggle; "Skip to content" linki.
- **Ekran Okuyucu Etiketleri:** `aria-label` örneği: “Saç rengi seçimi”. Görsel kartlarında `role="img"` ve açıklama: “Yapay üretilmiş insan portresi, kahverengi saçlı, genç yetişkin”.
- **Kontrast:** AA minimum; watermark ve uyarılar için yüksek kontrast.
- **Dil Desteği:** i18n JSON anahtarları; Türkçe örnek etiketler: “Ten Tono (Fitzpatrick)”, “Yaş Aralığı”, “Cinsiyet (isteğe bağlı)”, “Rastgele Karıştır”.
- **Disclaimers:** Her dilde zorunlu: “Bu resim yapay olarak üretilmiştir; gerçek bir kişiyi temsil etmez.”

## 9) Test ve QA Planı
- **UX:** Form doğrulama, hata mesajları, klavye erişimi, ekran okuyucu metinleri.
- **Model Çıktıları:** Seed deterministikliği, attribute uyumu (manüel ve otomatik tagger ile), çeşitlilik skoru.
- **Güvenlik:** NSFW/politik/nefret prompt testleri; ünlü isim tespiti; çocuk koruma senaryoları.
- **Performans:** P95 latency, soğuk başlatma süreleri, CDN cache hit oranı, GPU kullanım metrikleri.
- **Geri Bildirim:** “Bildir” butonunun log/alert ürettiğinin doğrulanması.

## 10) Yol Haritası ve Genişletmeler
- Toplu üretim (batch) ve varyasyon setleri
- Özellik slider’ları (örn. poz açısı, ışık)
- CSV/dışa aktarma ve paylaşım koleksiyonları
- Üçüncü taraflar için API anahtarları ve kullanım kotaları
- Kullanım analitiği: dönüşüm, üretim başarı oranı, ortalama üretim süresi, güvenlik blok oranı, rapor sayısı
- Kullanıcı rolleri ve ekip çalışma alanları; klasörler/koleksiyonlar

## Örnek Mikro Kopya (Turkish)
- **Butonlar:** “Oluştur”, “Tekrar Oluştur”, “İndir”, “Paylaş”, “Rastgele Karıştır”, “Filtreleri Sıfırla”.
- **Tooltips:** “Fitzpatrick skalası: 1 en açık, 6 en koyu.”
- **Banner:** “Bu servis yalnızca yapay görseller üretir; kimseyi taklit etmeyin.”
- **Hata:** “Girdi sınırını aşıyorsunuz, lütfen daha az özellik seçin.”

## Güvenlik İşaretleme ve Meta
- Her görsel: görünür “SYNTHETIC / ÜRETİLMİŞ” watermark.
- EXIF/XMP tag: `synthetic-image=true`, `generator=app-name`, `no-real-person=true`.
- CDN yanıt başlığı: `X-Generated-Image: synthetic`.

