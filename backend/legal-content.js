// FlowMind — Hukuki metinler (KANONİK KAYNAK)
//
// /privacy, /terms ve /support sayfalarının TEK kaynağı burasıdır.
// `web/*.html` kopyaları `npm run legal:sync` ile buradan üretilir — elle düzenlemeyin.
//
// ⚠️ Metinleri değiştirirken koddaki gerçek davranışla eşleştiğinden emin ol:
//    - Hangi veri toplanıyor  → backend/config/schema.sql, backend/utils/logger.js
//    - AI'a ne gidiyor        → lib/ai.ts, backend/routes/ai.js
//    - Ne saklanıyor/silinıyor → backend/routes/auth.js
//    - Cihazda ne tutuluyor   → lib/offlineStore.ts, expo-secure-store kullanımı

const CONTACT_EMAIL = 'emin3619@gmail.com';
const DEVELOPER = 'Emin Emre — Denizli, Türkiye';
const UPDATED_TR = '18 Ekim 2026';
const UPDATED_EN = 'October 18, 2026';

const PAGE_CSS = `
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px 64px; color: #1F2937; line-height: 1.65; background: #FFFFFF; }
  h1 { color: #6366F1; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; font-size: 26px; line-height: 1.3; }
  h2 { color: #4F46E5; margin-top: 32px; font-size: 19px; }
  h3 { color: #1F2937; margin-top: 22px; font-size: 16px; }
  .updated { color: #6B7280; font-size: 14px; }
  .lang-switch { background: #F3F4F6; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; }
  .lang-switch a { margin-right: 14px; }
  .card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 16px 0; }
  ul { padding-left: 24px; }
  li { margin: 6px 0; }
  a { color: #6366F1; }
  hr { margin: 48px 0; border: 0; border-top: 1px solid #E5E7EB; }
  footer { margin-top: 40px; font-size: 13px; color: #9CA3AF; }
  @media (prefers-color-scheme: dark) {
    body { background: #0B0B14; color: #E5E7EB; }
    h1 { color: #A5B4FC; border-bottom-color: #27273A; }
    h2 { color: #818CF8; }
    h3 { color: #E5E7EB; }
    .updated { color: #9CA3AF; }
    .lang-switch { background: #16162A; }
    .card { background: #14142A; border-color: #27273A; }
    a { color: #A5B4FC; }
    hr { border-top-color: #27273A; }
    footer { color: #6B7280; }
  }
`;

const shell = ({ title, body }) => `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>${PAGE_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;

/* ------------------------------------------------------------------ */
/* Gizlilik Politikası                                                 */
/* ------------------------------------------------------------------ */

const PRIVACY_BODY = `
<div class="lang-switch">
  <a href="#tr">🇹🇷 Türkçe</a><a href="#en">🇬🇧 English</a>
  <a href="/terms">Kullanım Koşulları</a><a href="/support">Destek</a>
</div>

<h1 id="tr">FlowMind — Gizlilik Politikası</h1>
<p class="updated">Son güncelleme: ${UPDATED_TR}</p>

<p>FlowMind ("uygulama", "biz") gizliliğinize değer verir. Bu politika, FlowMind mobil uygulamasını kullandığınızda hangi verileri topladığımızı, neden topladığımızı, kimlerle paylaştığımızı ve haklarınızı açıklar.</p>

<h2>1. Topladığımız Veriler</h2>
<ul>
  <li><strong>Hesap bilgileri:</strong> E-posta adresiniz, adınız ve bcrypt (12 tur) ile hash'lenmiş parolanız. Parolanız hiçbir zaman düz metin olarak saklanmaz.</li>
  <li><strong>Uygulama verisi:</strong> Oluşturduğunuz görevler (başlık, açıklama, kategori, öncelik, tahmini süre, son tarih), odak (Pomodoro) oturumları, enerji seviyesi kayıtları, kazandığınız XP, seviye, seri (streak) ve rozetler.</li>
  <li><strong>Teknik veri:</strong> API isteklerinizde IP adresiniz ve istek kayıtları (metot, yol, zaman) güvenlik ve suistimal önleme amacıyla sunucu log'larında saklanır. Hız sınırı (rate-limit) sayaçları 15 dakika sonra sıfırlanır.</li>
  <li><strong>Cihazınızda kalan veri:</strong> Oturum anahtarınız (iOS Keychain / SecureStore) ve çevrimdışı çalışma için görev önbelleği ile bekleyen işlem kuyruğu (AsyncStorage). Bu veriler cihazınızdan çıkmaz; uygulamayı sildiğinizde silinir.</li>
</ul>

<h2>2. Toplamadığımız Veriler</h2>
<ul>
  <li>Konum verisi (GPS)</li>
  <li>Reklam tanımlayıcıları (IDFA) ve reklam amaçlı izleme — uygulamada reklam ve izleme SDK'sı yoktur</li>
  <li>Üçüncü taraf analitik (Google Analytics, Firebase Analytics vb.)</li>
  <li>Apple Health / HealthKit verisi</li>
  <li>Kişi listeniz, fotoğraflarınız, kameranız ve mikrofonunuz — uygulama bu izinleri istemez</li>
  <li>Çerez (cookie) — uygulama çerez kullanmaz</li>
</ul>
<p>Bildirimler cihazınızda yerel olarak planlanır. Push bildirim token'ı sunucularımıza gönderilmez ve sunucularımızda saklanmaz.</p>

<h2>3. Verilerinizi Nasıl Kullanıyoruz</h2>
<ul>
  <li>Hesabınıza giriş yapmanız ve oturumunuzun korunması için (JWT, 7 gün geçerlilik).</li>
  <li>Görev, odak ve enerji geçmişinizi cihazlar arasında senkronize tutmak için.</li>
  <li>Gamification (XP, seviye, seri) ve istatistikleri hesaplamak için.</li>
  <li>AI destekli günlük plan, öneri ve görev analizi üretmek için (bkz. bölüm 4).</li>
  <li>Suistimali ve aşırı kullanımı önlemek için.</li>
</ul>
<p>Verilerinizi <strong>satmıyoruz</strong>. Reklam veya pazarlama amacıyla üçüncü taraflarla paylaşmıyoruz. Profil oluşturmuyoruz.</p>

<h2>4. Yapay Zekâ Özellikleri ve Üçüncü Taraf Servisler</h2>
<p>FlowMind'ın günlük öneri, haftalık rapor, görev analizi, akıllı zamanlama ve doğal dille görev oluşturma özellikleri yapay zekâ kullanır. Bu istekler sunucumuzdan <strong>OpenRouter</strong> (openrouter.ai — yapay zekâ modeli geçidi) üzerinden bir dil modeli sağlayıcısına iletilir.</p>
<h3>AI servisine gönderilen içerik</h3>
<ul>
  <li>Görev metinleri (başlık ve açıklama), kategori, öncelik ve tahmini süre</li>
  <li>Enerji seviyeniz (1–5) ve verimli saat aralığınız</li>
  <li>Özet istatistikler: tamamlanan görev sayısı, odaklanma süresi, seri ve XP</li>
  <li>Doğal dille görev oluştururken yazdığınız metin</li>
</ul>
<h3>AI servisine gönderilmeyen içerik</h3>
<ul>
  <li>E-posta adresiniz, adınız, kullanıcı kimliğiniz ve parolanız</li>
  <li>IP adresiniz — istek sunucumuzdan yapılır</li>
</ul>
<p>OpenRouter ve model sağlayıcıları, istek içeriğini kendi veri politikalarına göre belirli bir süre saklayabilir ve hesap ayarlarına bağlı olarak model geliştirme amacıyla kullanabilir. Ayrıntı için OpenRouter gizlilik politikasına bakın: <a href="https://openrouter.ai/privacy" rel="noopener">openrouter.ai/privacy</a>.</p>
<p><strong>Önerimiz:</strong> Görev metinlerine parola, kimlik numarası, sağlık bilgisi veya başkasına ait özel bilgi gibi hassas içerik yazmayın. Uygulama bu tür veriler için tasarlanmamıştır.</p>
<p>Bunların dışında uygulama, verilerinizi bir sunucuya gönderen başka bir üçüncü taraf servis kullanmaz.</p>

<h2>5. Verileriniz Nerede Saklanıyor</h2>
<p>Tüm hesap ve uygulama verileriniz, kendi barındırdığımız sunucuda (Türkiye) bir PostgreSQL veritabanında saklanır. Sunucuya erişim HTTPS/TLS ile şifrelenir; veritabanı yalnızca uygulama sunucusundan erişilebilir, internete açık değildir. AI dışındaki veri işlemleri bu sunucuda gerçekleşir.</p>

<h2>6. Veri Saklama ve Silme</h2>
<p>Hesabınızı <strong>uygulama içinden</strong> silebilirsiniz: Profil → Hesabımı Sil. Onay için parolanızı girmeniz istenir. Silme işlemi anında gerçekleşir; hesabınıza ait görevler, odak oturumları, enerji kayıtları, istatistikler ve hesap bilgileri veritabanından ilişkisel olarak (cascade delete) kaldırılır. Cihazınızda kalan oturum anahtarı ve çevrimdışı kopyalar da temizlenir.</p>
<p>Dilerseniz bölüm 10'daki iletişim adresine yazarak da silme talep edebilirsiniz; bu durumda talep <strong>7 gün içinde</strong> tamamlanır. Hesabınız aktif olduğu sürece veriler saklanır. 90 gün boyunca giriş yapılmayan hesaplar bilgilendirilir ve ardından silinir.</p>

<h2>7. Çocukların Gizliliği</h2>
<p>FlowMind 13 yaş altı çocuklar için tasarlanmamıştır. 13 yaş altı bir kullanıcıdan bilerek veri toplamayız; bu durumu fark ettiğimizde hesabı ve ilgili verileri sileriz.</p>

<h2>8. Haklarınız (KVKK / GDPR)</h2>
<p>Kişisel verileriniz üzerinde şu haklara sahipsiniz:</p>
<ul>
  <li>Verilerinize erişme ve işlenip işlenmediğini öğrenme</li>
  <li>Düzeltme talep etme</li>
  <li>Silme ("unutulma hakkı") talep etme</li>
  <li>İşlemeye itiraz etme ve kısıtlama talep etme</li>
  <li>Verilerinizin taşınabilir bir kopyasını alma</li>
</ul>
<p>Talepleriniz 30 gün içinde yanıtlanır.</p>

<h2>9. Bu Politikadaki Değişiklikler</h2>
<p>Politika güncellendiğinde yukarıdaki "Son güncelleme" tarihi değişir. Veri toplama veya paylaşım pratiklerini önemli ölçüde etkileyen değişiklikleri uygulama içinden duyururuz ve gerekiyorsa yeniden onayınızı isteriz.</p>

<h2>10. İletişim</h2>
<p>Sorular, veri talepleri ve şikayetler için: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br>
Geliştirici: ${DEVELOPER}</p>

<hr>

<h1 id="en">FlowMind — Privacy Policy</h1>
<p class="updated">Last updated: ${UPDATED_EN}</p>

<p>FlowMind ("the app", "we") respects your privacy. This policy explains what we collect when you use the FlowMind mobile app, why we collect it, who we share it with, and what rights you have.</p>

<h2>1. Data We Collect</h2>
<ul>
  <li><strong>Account info:</strong> Your email address, your name, and your password hashed with bcrypt (12 rounds). Your password is never stored in plain text.</li>
  <li><strong>App data:</strong> Tasks you create (title, description, category, priority, estimated minutes, due date), focus (Pomodoro) sessions, energy level logs, earned XP, level, streak and badges.</li>
  <li><strong>Technical data:</strong> Your IP address and request logs (method, path, timestamp) are kept in server logs for security and abuse prevention. Rate-limit counters reset after 15 minutes.</li>
  <li><strong>Data that stays on your device:</strong> Your session key (iOS Keychain / SecureStore) plus an offline task cache and a pending-actions queue (AsyncStorage) for offline support. This data never leaves your device and is removed when you delete the app.</li>
</ul>

<h2>2. Data We Do NOT Collect</h2>
<ul>
  <li>Location data (GPS)</li>
  <li>Advertising identifiers (IDFA) or ad tracking — the app contains no ads and no tracking SDKs</li>
  <li>Third-party analytics (Google Analytics, Firebase Analytics, etc.)</li>
  <li>Apple Health / HealthKit data</li>
  <li>Your contacts, photos, camera or microphone — the app never requests these permissions</li>
  <li>Cookies — the app does not use cookies</li>
</ul>
<p>Notifications are scheduled locally on your device. No push notification token is sent to or stored on our servers.</p>

<h2>3. How We Use Your Data</h2>
<ul>
  <li>To authenticate you and keep your session (JWT, 7-day expiry).</li>
  <li>To sync your tasks, focus and energy history across your devices.</li>
  <li>To calculate gamification (XP, level, streak) and statistics.</li>
  <li>To generate AI-assisted daily plans, insights and task analysis (see section 4).</li>
  <li>To prevent abuse and excessive usage.</li>
</ul>
<p>We <strong>do not sell</strong> your data. We do not share it with third parties for advertising or marketing, and we do not build profiles.</p>

<h2>4. AI Features and Third-Party Services</h2>
<p>FlowMind's daily insight, weekly report, task analysis, smart scheduling and natural-language task creation features use artificial intelligence. Those requests are sent from our server to <strong>OpenRouter</strong> (openrouter.ai, an AI model gateway), which routes them to a language model provider.</p>
<h3>What is sent to the AI service</h3>
<ul>
  <li>Task text (title and description), category, priority and estimated minutes</li>
  <li>Your energy level (1–5) and your peak hours</li>
  <li>Summary statistics: completed tasks, focus minutes, streak and XP</li>
  <li>The text you type when creating a task in natural language</li>
</ul>
<h3>What is NOT sent to the AI service</h3>
<ul>
  <li>Your email address, name, user ID or password</li>
  <li>Your IP address — requests originate from our server</li>
</ul>
<p>OpenRouter and the model providers may retain request content for a period and, depending on account settings, use it to improve their models, in line with their own data policies. See OpenRouter's privacy policy: <a href="https://openrouter.ai/privacy" rel="noopener">openrouter.ai/privacy</a>.</p>
<p><strong>Our advice:</strong> do not put sensitive content such as passwords, national ID numbers, health information or other people's private details into task text. The app is not designed for such data.</p>
<p>Other than this, the app uses no third-party service that receives your data.</p>

<h2>5. Where Your Data Is Stored</h2>
<p>All account and app data is stored in a PostgreSQL database on a server we host ourselves (Türkiye). Access to the server is encrypted with HTTPS/TLS, and the database is reachable only from the application server, not from the public internet. All non-AI data processing happens on that server.</p>

<h2>6. Retention and Deletion</h2>
<p>You can delete your account <strong>inside the app</strong>: Profile → Delete My Account. You will be asked for your password to confirm. Deletion is immediate: your tasks, focus sessions, energy logs, statistics and account details are removed from the database by cascade delete. The session key and offline copies stored on your device are cleared as well.</p>
<p>You may also request deletion by writing to the address in section 10; in that case the request is completed within <strong>7 days</strong>. Data is retained while your account is active. Accounts inactive for 90 days are notified and then deleted.</p>

<h2>7. Children's Privacy</h2>
<p>FlowMind is not designed for children under 13. We do not knowingly collect data from anyone under 13; if we discover such an account we delete it and its data.</p>

<h2>8. Your Rights (GDPR / KVKK)</h2>
<p>You have the right to:</p>
<ul>
  <li>Access your data and learn whether it is processed</li>
  <li>Request correction</li>
  <li>Request deletion ("right to be forgotten")</li>
  <li>Object to or restrict processing</li>
  <li>Receive a portable copy of your data</li>
</ul>
<p>Requests are answered within 30 days.</p>

<h2>9. Changes to This Policy</h2>
<p>When this policy changes, the "Last updated" date above is bumped. We announce material changes to data collection or sharing practices in the app and ask for your consent again where required.</p>

<h2>10. Contact</h2>
<p>Questions, data requests and complaints: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br>
Developer: ${DEVELOPER}</p>

<footer>© 2026 FlowMind</footer>
`;

/* ------------------------------------------------------------------ */
/* Kullanım Koşulları                                                  */
/* ------------------------------------------------------------------ */

const TERMS_BODY = `
<div class="lang-switch">
  <a href="#tr">🇹🇷 Türkçe</a><a href="#en">🇬🇧 English</a>
  <a href="/privacy">Gizlilik Politikası</a><a href="/support">Destek</a>
</div>

<h1 id="tr">FlowMind — Kullanım Koşulları</h1>
<p class="updated">Son güncelleme: ${UPDATED_TR}</p>

<p>Bu koşullar, FlowMind mobil uygulamasını ("uygulama") kullanımınızı düzenler. Uygulamayı kullanarak bu koşulları kabul etmiş olursunuz. Kabul etmiyorsanız uygulamayı kullanmayın.</p>

<h2>1. Hizmetin Tanımı</h2>
<p>FlowMind, görev yönetimi, enerji takibi, odaklanma (Pomodoro) zamanlayıcısı, istatistik ve yapay zekâ destekli planlama özellikleri sunan bir verimlilik uygulamasıdır. Geliştirici: ${DEVELOPER}.</p>

<h2>2. Hesabınız ve Sorumluluklarınız</h2>
<ul>
  <li>Hesabınızın ve parolanızın güvenliğinden siz sorumlusunuz.</li>
  <li>Kayıt sırasında doğru bilgi vermeniz beklenir.</li>
  <li>Hesabınızı başkalarına devredemez, satamaz veya kiralayamazsınız.</li>
  <li>Tek kişilik kullanım içindir; otomatik yollarla toplu hesap oluşturamazsınız.</li>
</ul>

<h2>3. Yapay Zekâ Önerileri</h2>
<p>Uygulamadaki yapay zekâ çıktıları yalnızca <strong>bilgilendirme ve öneri</strong> amaçlıdır; tıbbi, psikolojik, hukuki veya finansal profesyonel tavsiye niteliği taşımaz. Üretilen metinler hatalı veya eksik olabilir. Kararlarınızın sorumluluğu size aittir.</p>
<p>AI özelliğini kullanırken sağlık verisi, kimlik numarası, parola veya üçüncü kişilere ait özel bilgi gibi hassas içerik girmemelisiniz (bkz. Gizlilik Politikası bölüm 4).</p>

<h2>4. Kabul Edilemez Kullanım</h2>
<ul>
  <li>Uygulamayı yasa dışı amaçlarla kullanmak</li>
  <li>Sunuculara aşırı yük bindirmek, otomatik istek göndermek veya güvenlik önlemlerini aşmaya çalışmak</li>
  <li>Başka kullanıcıların hesaplarına veya verilerine erişmeye çalışmak</li>
  <li>Uygulamayı tersine mühendislikle çözmek, kopyalamak veya izinsiz dağıtmak</li>
</ul>
<p>Bu kurallara aykırı kullanımda hesabınız askıya alınabilir veya kapatılabilir.</p>

<h2>5. Ücretsiz Kullanım</h2>
<p>FlowMind şu anda ücretsizdir ve uygulama içi satın alma ya da otomatik yenilenen abonelik içermez. İleride ücretli bir plan sunulursa, fiyat, süre, yenilenme ve iptal koşulları bu sayfada ve satın alma ekranında açıkça belirtilir; bu koşullar da güncellenir.</p>

<h2>6. Fikri Mülkiyet</h2>
<p>Uygulamanın kodu, tasarımı, markası ve içeriği geliştiriciye aittir ve telif hakkı ile korunur. Bu koşullar size yalnızca kişisel, devredilemez ve münhasır olmayan bir kullanım lisansı verir.</p>

<h2>7. Hizmetin Sürekliliği ve Değişiklikler</h2>
<p>Özellikleri geliştirebilir, değiştirebilir veya kaldırabiliriz. Hizmetin kesintisiz çalışacağını garanti etmiyoruz; bakım, güncelleme veya teknik arıza nedeniyle hizmet geçici olarak kullanılamayabilir. Bu koşulları güncellediğimizde yukarıdaki tarih değişir.</p>

<h2>8. Hesabın Kapatılması ve Fesih</h2>
<p>Hesabınızı istediğiniz zaman silebilirsiniz; silme talebiniz 7 gün içinde işleme alınır. Koşulları ihlal etmeniz durumunda erişiminizi askıya alabilir veya sonlandırabiliriz.</p>

<h2>9. Sorumluluğun Sınırlandırılması</h2>
<p>Uygulama "olduğu gibi" sunulur. Yasaların izin verdiği azami ölçüde; uygulamanın kullanımından doğan dolaylı, arızi veya sonuçsal zararlar ile veri kaybı, kâr veya iş kaybı için sorumluluk kabul etmiyoruz. Bu hüküm, tüketici mevzuatından doğan ve sözleşmeyle sınırlandırılamayan haklarınızı etkilemez.</p>

<h2>10. Uygulanacak Hukuk</h2>
<p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda Türkiye'deki yetkili mahkeme ve tüketici hakem heyetleri yetkilidir; tüketici olarak kendi yerleşim yerindeki mercilere başvurma hakkınız saklıdır.</p>

<h2>11. Apple App Store — Ek Hükümler</h2>
<p>Uygulamayı Apple App Store üzerinden edindiyseniz, aşağıdaki hükümler Apple'ın asgari lisans koşulları gereği ayrıca geçerlidir:</p>
<ol>
  <li>Bu koşullar yalnızca sizinle geliştirici arasındadır; Apple değil. Uygulama ve içeriğinden yalnızca geliştirici sorumludur.</li>
  <li>Size verilen lisans, Apple'ın Kullanım Kuralları'na (Usage Rules) tabi olarak Apple markalı cihazlarda kullanım için verilen devredilemez bir lisanstır.</li>
  <li>Bakım ve destek yükümlülüğü yalnızca geliştiriciye aittir; Apple'ın bu konuda yükümlülüğü yoktur.</li>
  <li>Uygulamaya ilişkin garanti yükümlülükleri geliştiriciye aittir. Uygulama geçerli bir garantiye uymazsa, kullanıcı Apple'a bildirimde bulunarak (varsa) ödediği bedelin iadesini talep edebilir; Apple'ın bunun ötesinde garanti yükümlülüğü yoktur.</li>
  <li>Uygulamaya ilişkin ürün ve tüketici talepleri, yasal düzenlemelere uygunluk iddiaları ve fikri mülkiyet ihlali iddiaları geliştirici tarafından karşılanır.</li>
  <li>Kullanıcı, ambargo uygulanan bir ülkede bulunmadığını ve yasaklı kişi listelerinde yer almadığını beyan eder.</li>
  <li>Apple ve bağlı şirketleri bu koşulların üçüncü taraf lehdarıdır ve bu koşulları size karşı uygulama hakkına sahiptir.</li>
</ol>

<h2>12. İletişim</h2>
<p>Sorularınız için: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>

<hr>

<h1 id="en">FlowMind — Terms of Service</h1>
<p class="updated">Last updated: ${UPDATED_EN}</p>

<p>These terms govern your use of the FlowMind mobile application ("the app"). By using the app you accept these terms. If you do not accept them, do not use the app.</p>

<h2>1. Description of Service</h2>
<p>FlowMind is a productivity app offering task management, energy tracking, a focus (Pomodoro) timer, statistics and AI-assisted planning. Developer: ${DEVELOPER}.</p>

<h2>2. Your Account and Responsibilities</h2>
<ul>
  <li>You are responsible for the security of your account and password.</li>
  <li>You are expected to provide accurate information at registration.</li>
  <li>You may not transfer, sell or rent your account.</li>
  <li>The service is for single-user use; you may not create accounts in bulk by automated means.</li>
</ul>

<h2>3. AI Suggestions</h2>
<p>AI output in the app is for <strong>informational and suggestion</strong> purposes only and is not medical, psychological, legal or financial advice. Generated text may be wrong or incomplete. You remain responsible for your decisions.</p>
<p>When using AI features, do not enter sensitive content such as health data, national ID numbers, passwords or other people's private information (see section 4 of the Privacy Policy).</p>

<h2>4. Acceptable Use</h2>
<ul>
  <li>Do not use the app for unlawful purposes.</li>
  <li>Do not overload our servers, send automated requests, or attempt to bypass security measures.</li>
  <li>Do not attempt to access other users' accounts or data.</li>
  <li>Do not reverse engineer, copy or redistribute the app without permission.</li>
</ul>
<p>We may suspend or close your account for breaching these rules.</p>

<h2>5. Free Use</h2>
<p>FlowMind is currently free and contains no in-app purchases or auto-renewing subscriptions. If a paid plan is introduced in the future, its price, duration, renewal and cancellation terms will be stated clearly on this page and in the purchase screen, and these terms will be updated.</p>

<h2>6. Intellectual Property</h2>
<p>The app's code, design, brand and content belong to the developer and are protected by copyright. These terms grant you only a personal, non-transferable, non-exclusive licence to use the app.</p>

<h2>7. Availability and Changes</h2>
<p>We may improve, change or remove features. We do not guarantee uninterrupted service; the service may be temporarily unavailable due to maintenance, updates or technical failure. When we update these terms, the date above changes.</p>

<h2>8. Account Closure and Termination</h2>
<p>You may delete your account at any time; deletion requests are processed within 7 days. If you breach these terms we may suspend or terminate your access.</p>

<h2>9. Limitation of Liability</h2>
<p>The app is provided "as is". To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential damages arising from your use of the app, or for loss of data, profit or business. This does not affect rights you have under consumer law that cannot be limited by agreement.</p>

<h2>10. Governing Law</h2>
<p>These terms are governed by the laws of the Republic of Türkiye. The competent courts and consumer arbitration boards in Türkiye have jurisdiction; as a consumer you keep the right to bring proceedings in your place of residence.</p>

<h2>11. Apple App Store — Additional Terms</h2>
<p>If you obtained the app through the Apple App Store, the following applies as required by Apple's minimum licence terms:</p>
<ol>
  <li>These terms are between you and the developer only, not with Apple. The developer, not Apple, is solely responsible for the app and its content.</li>
  <li>The licence granted is a non-transferable licence to use the app on Apple-branded devices, subject to Apple's Usage Rules.</li>
  <li>Maintenance and support are the developer's sole responsibility; Apple has no obligation to provide them.</li>
  <li>Any warranty obligations for the app rest with the developer. If the app fails to conform to an applicable warranty, you may notify Apple for a refund of the purchase price (if any); Apple has no other warranty obligation.</li>
  <li>Product and consumer claims, claims of non-compliance with law, and intellectual property infringement claims are the developer's responsibility.</li>
  <li>You represent that you are not located in a country subject to an embargo and are not on any prohibited-party list.</li>
  <li>Apple and its subsidiaries are third-party beneficiaries of these terms and may enforce them against you.</li>
</ol>

<h2>12. Contact</h2>
<p>Questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>

<footer>© 2026 FlowMind</footer>
`;

/* ------------------------------------------------------------------ */
/* Destek                                                              */
/* ------------------------------------------------------------------ */

const SUPPORT_BODY = `
<div class="lang-switch">
  <a href="#tr">🇹🇷 Türkçe</a><a href="#en">🇬🇧 English</a>
  <a href="/privacy">Gizlilik Politikası</a><a href="/terms">Kullanım Koşulları</a>
</div>

<h1 id="tr">FlowMind — Destek</h1>

<div class="card">
  <h2>İletişim</h2>
  <p>Sorularınız, hata bildirimleriniz ve önerileriniz için:</p>
  <p><strong>E-posta:</strong> <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
  <p>Genellikle 24 saat içinde yanıt veriyoruz.</p>
</div>

<div class="card">
  <h2>Sık Sorulan Sorular</h2>
  <h3>Hesabımı nasıl silerim?</h3>
  <p>Profil → <strong>Hesabımı Sil</strong> yolundan uygulama içinden silebilirsiniz; silme anında gerçekleşir. Alternatif olarak yukarıdaki e-posta adresine yazabilirsiniz; bu durumda 7 gün içinde tamamlanır. Nelerin silindiği için <a href="/privacy">Gizlilik Politikası</a> bölüm 6'ya bakın.</p>
  <h3>Şifremi unuttum.</h3>
  <p>Otomatik parola sıfırlama henüz yok. E-posta gönderin; hesabınız için size özel bir bağlantı ile parolanızı sıfırlamanızı sağlarız.</p>
  <h3>AI önerileri gelmiyor.</h3>
  <p>AI özellikleri internet bağlantısı ve sunucu erişimi gerektirir. Bağlantınızı kontrol edin; sorun sürerse bize yazın. AI çalışmadığında uygulamanın diğer tüm özellikleri çalışmaya devam eder.</p>
  <h3>Verilerim güvende mi?</h3>
  <p>Evet — parolalar bcrypt ile hash'lenir, oturumlar JWT ile korunur, tüm trafik HTTPS/TLS üzerinden gider ve veriler kendi barındırdığımız sunucuda tutulur. Ayrıntı için <a href="/privacy">Gizlilik Politikası</a>.</p>
  <h3>Bildirimler gelmiyor.</h3>
  <p>Bildirim izinlerini iOS Ayarlar → FlowMind → Bildirimler üzerinden açın. Hatırlatıcılar cihazınızda yerel olarak planlanır.</p>
</div>

<hr>

<h1 id="en">FlowMind — Support</h1>

<div class="card">
  <h2>Contact</h2>
  <p>For questions, bug reports and feedback:</p>
  <p><strong>Email:</strong> <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
  <p>We usually reply within 24 hours.</p>
</div>

<div class="card">
  <h2>Frequently Asked Questions</h2>
  <h3>How do I delete my account?</h3>
  <p>Inside the app: Profile → <strong>Delete My Account</strong>. Deletion is immediate. Alternatively email the address above and it is completed within 7 days. See section 6 of the <a href="/privacy">Privacy Policy</a> for what is covered.</p>
  <h3>I forgot my password.</h3>
  <p>Self-serve reset is not available yet. Email us and we will send you a personal link to reset your password.</p>
  <h3>AI suggestions are not loading.</h3>
  <p>AI features need an internet connection and access to our server. Check your connection, and contact us if the problem continues. When AI is unavailable, all other features of the app keep working.</p>
  <h3>Is my data safe?</h3>
  <p>Yes — passwords are hashed with bcrypt, sessions are protected with JWT, all traffic uses HTTPS/TLS, and data is stored on a server we host ourselves. See the <a href="/privacy">Privacy Policy</a> for details.</p>
  <h3>Notifications are not arriving.</h3>
  <p>Enable notifications in iOS Settings → FlowMind → Notifications. Reminders are scheduled locally on your device.</p>
</div>

<footer>© 2026 FlowMind</footer>
`;

const pages = {
    privacy: shell({
        title: 'FlowMind — Gizlilik Politikası / Privacy Policy',
        body: PRIVACY_BODY,
    }),
    terms: shell({
        title: 'FlowMind — Kullanım Koşulları / Terms of Service',
        body: TERMS_BODY,
    }),
    support: shell({
        title: 'FlowMind — Destek / Support',
        body: SUPPORT_BODY,
    }),
};

module.exports = { pages, CONTACT_EMAIL, DEVELOPER };
