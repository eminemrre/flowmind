const express = require('express');
const router = express.Router();

const PRIVACY_POLICY_HTML = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FlowMind — Gizlilik Politikası / Privacy Policy</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 720px; margin: 0 auto; padding: 32px 20px; color: #1F2937; line-height: 1.6; }
  h1 { color: #6366F1; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; }
  h2 { color: #4F46E5; margin-top: 32px; }
  .lang-switch { background: #F3F4F6; padding: 12px; border-radius: 8px; margin-bottom: 24px; }
  .updated { color: #6B7280; font-size: 14px; }
  ul { padding-left: 24px; }
  li { margin: 6px 0; }
  a { color: #6366F1; }
</style>
</head>
<body>

<h1>FlowMind — Gizlilik Politikası</h1>
<p class="updated">Son güncelleme: 24 Mayıs 2026</p>

<p>FlowMind ("uygulama", "biz") gizliliğinize değer veriyoruz. Bu politika, FlowMind iOS uygulamasını kullandığınızda hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı açıklar.</p>

<h2>1. Topladığımız Veriler</h2>
<ul>
  <li><strong>Hesap bilgileri:</strong> E-posta adresi, isim, şifrelenmiş parola (bcrypt, 12 round).</li>
  <li><strong>Uygulama verisi:</strong> Eklediğiniz görevler, odak (Pomodoro) oturumları, enerji seviyesi logları, kazandığınız XP ve seviye.</li>
  <li><strong>Teknik veri:</strong> Her API isteğinde IP adresi (rate-limit ve güvenlik için 15 dakika boyunca tutulur), HTTP istek log'ları (Winston ile).</li>
</ul>

<h2>2. Toplamadığımız Veriler</h2>
<ul>
  <li>Konum verisi (GPS)</li>
  <li>Reklam tanımlayıcıları (IDFA, AAID)</li>
  <li>Üçüncü taraf analitiği (Google Analytics, Firebase Analytics vb.)</li>
  <li>Apple Health veya HealthKit verisi</li>
  <li>Push notification token'ı (henüz aktif değil)</li>
  <li>Çerez (cookie) — uygulama cookie kullanmaz</li>
</ul>

<h2>3. Verilerinizi Nasıl Kullanıyoruz</h2>
<ul>
  <li>Hesabınıza giriş yapmanız ve oturum korumanız için (JWT, 7 günlük geçerlilik).</li>
  <li>Görev, odak ve enerji geçmişinizi cihazlar arasında senkronize tutmak için.</li>
  <li>Gamification (XP, seviye, streak) hesaplamak için.</li>
  <li>Rate limiting ile suistimali önlemek için.</li>
</ul>

<h2>4. Veriler Nerede Saklanıyor</h2>
<p>Tüm veriler Türkiye'de host edilen Hetzner sunucularımızda (217.60.254.141) PostgreSQL veritabanında saklanır. Sunucular Dokploy ile yönetilir, TLS 1.3 ile şifrelenmiş HTTPS üzerinden erişilir. Veritabanına yalnızca uygulama backend'i erişebilir, dış internete açık değildir.</p>

<h2>5. Üçüncü Taraf Servisler</h2>
<p>Şu an FlowMind MVP'sinde üçüncü taraf servis kullanılmamaktadır. Gelecek bir sürümde AI önerileri için OpenRouter (cloud LLM gateway) eklenebilir; bu durumda yalnızca anonim görev metni ve enerji seviyesi gönderilir, kullanıcı kimliği iletilmez. Bu eklendiğinde politika güncellenecektir.</p>

<h2>6. Veri Saklama ve Silme</h2>
<p>Hesabınızı silmek istiyorsanız <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a> adresine yazın; 7 gün içinde verileriniz kalıcı olarak silinir (PostgreSQL cascade delete). Saklama: hesap aktif kaldığı sürece veriler tutulur; son 90 gün giriş yapmayan hesaplar uyarı sonrası silinir.</p>

<h2>7. Çocukların Gizliliği</h2>
<p>FlowMind 13 yaş altı çocuklar için tasarlanmamıştır. 13 yaş altı bir kullanıcıdan bilerek veri toplamayız. Bu yaşta olduğunu fark ettiğimiz hesaplar derhal silinir.</p>

<h2>8. Haklarınız (GDPR / KVKK)</h2>
<p>Kişisel verileriniz üzerinde şu haklara sahipsiniz:</p>
<ul>
  <li>Verilere erişim talep etme</li>
  <li>Düzeltme talep etme</li>
  <li>Silme talep etme ("unutulma hakkı")</li>
  <li>İşlemeye itiraz etme</li>
  <li>Verilerinizin kopyasını alma (data portability)</li>
</ul>
<p>Talepler için: <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a> — 30 gün içinde yanıtlanır.</p>

<h2>9. Bu Politikadaki Değişiklikler</h2>
<p>Politika güncellendiğinde "Son güncelleme" tarihi değişir. Önemli değişiklikleri uygulama içi bildirimle duyururuz.</p>

<h2>10. İletişim</h2>
<p>Sorular için: <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a><br>
Geliştirici: Emin Emre — Denizli, Türkiye</p>

<hr style="margin: 48px 0; border: 0; border-top: 1px solid #E5E7EB;">

<h1>FlowMind — Privacy Policy (English)</h1>
<p class="updated">Last updated: May 24, 2026</p>

<p>FlowMind ("the app", "we") respects your privacy. This policy explains what data we collect when you use the FlowMind iOS app, how we use it, and your rights.</p>

<h2>1. Data We Collect</h2>
<ul>
  <li><strong>Account info:</strong> Email address, name, hashed password (bcrypt, 12 rounds).</li>
  <li><strong>App data:</strong> Tasks you create, focus (Pomodoro) sessions, energy logs, earned XP and level.</li>
  <li><strong>Technical data:</strong> IP address per API request (kept 15 minutes for rate limiting), HTTP request logs (via Winston).</li>
</ul>

<h2>2. Data We Do NOT Collect</h2>
<ul>
  <li>Location data (GPS)</li>
  <li>Advertising identifiers (IDFA, AAID)</li>
  <li>Third-party analytics (Google Analytics, Firebase, etc.)</li>
  <li>Apple Health / HealthKit data</li>
  <li>Push notification tokens (not yet active)</li>
  <li>Cookies — the app does not use cookies</li>
</ul>

<h2>3. How We Use Your Data</h2>
<ul>
  <li>To authenticate you and keep your session (JWT, 7-day expiry).</li>
  <li>To sync your tasks, focus and energy history across devices.</li>
  <li>To calculate gamification (XP, level, streak).</li>
  <li>To prevent abuse via rate limiting.</li>
</ul>

<h2>4. Where Data Is Stored</h2>
<p>All data is stored in our Hetzner servers in Türkiye (217.60.254.141) in a PostgreSQL database. Servers are managed by Dokploy and accessed via HTTPS encrypted with TLS 1.3. The database is reachable only from the application backend, not the public internet.</p>

<h2>5. Third Parties</h2>
<p>The current FlowMind MVP uses no third-party services. A future version may add AI suggestions via OpenRouter (a cloud LLM gateway); in that case only anonymous task text and energy level would be sent, without user identity. This policy will be updated when that change ships.</p>

<h2>6. Retention and Deletion</h2>
<p>To delete your account, email <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a>; data is permanently removed within 7 days (PostgreSQL cascade delete). Active accounts are kept indefinitely; accounts inactive for 90 days are warned and then deleted.</p>

<h2>7. Children's Privacy</h2>
<p>FlowMind is not designed for children under 13. We do not knowingly collect data from anyone under 13; such accounts are deleted on discovery.</p>

<h2>8. Your Rights (GDPR / KVKK)</h2>
<p>You have the right to:</p>
<ul>
  <li>Request access to your data</li>
  <li>Request correction</li>
  <li>Request deletion ("right to be forgotten")</li>
  <li>Object to processing</li>
  <li>Receive a portable copy of your data</li>
</ul>
<p>Requests: <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a> — answered within 30 days.</p>

<h2>9. Changes to This Policy</h2>
<p>When this policy changes the "Last updated" date is bumped. Material changes are announced via in-app notification.</p>

<h2>10. Contact</h2>
<p>Questions: <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a><br>
Developer: Emin Emre — Denizli, Türkiye</p>

</body>
</html>`;

const SUPPORT_HTML = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FlowMind — Destek / Support</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #1F2937; line-height: 1.6; }
  h1 { color: #6366F1; }
  a { color: #6366F1; }
  .card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 16px 0; }
</style>
</head>
<body>

<h1>FlowMind Destek</h1>

<div class="card">
  <h2>İletişim</h2>
  <p>Sorularınız, hata raporlarınız veya öneriniz için:</p>
  <p><strong>E-posta:</strong> <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a></p>
  <p>Genelde 24 saat içinde yanıt verilir.</p>
</div>

<div class="card">
  <h2>Sık Sorulanlar</h2>
  <p><strong>Hesabımı nasıl silebilirim?</strong><br>
  E-posta gönderin, 7 gün içinde tüm verileriniz silinir.</p>
  <p><strong>Şifremi unuttum.</strong><br>
  Şu an parola sıfırlama otomatik değil; e-posta gönderin, manuel sıfırlanır.</p>
  <p><strong>Verilerim güvende mi?</strong><br>
  Evet — bcrypt şifre hash, JWT auth, HTTPS/TLS 1.3, Türkiye'de host. Detay için <a href="/privacy">Gizlilik Politikası</a>.</p>
</div>

<hr>

<h1>FlowMind Support</h1>

<div class="card">
  <h2>Contact</h2>
  <p>For questions, bug reports, or feedback:</p>
  <p><strong>Email:</strong> <a href="mailto:emin3619@gmail.com">emin3619@gmail.com</a></p>
  <p>Typical response: within 24 hours.</p>
</div>

<div class="card">
  <h2>FAQ</h2>
  <p><strong>How do I delete my account?</strong><br>
  Email us; data is removed within 7 days.</p>
  <p><strong>I forgot my password.</strong><br>
  Self-serve reset isn't available yet; email us and it's reset manually.</p>
  <p><strong>Is my data safe?</strong><br>
  Yes — bcrypt hashing, JWT auth, HTTPS/TLS 1.3, hosted in Türkiye. See <a href="/privacy">Privacy Policy</a>.</p>
</div>

</body>
</html>`;

router.get('/privacy', (req, res) => {
    res.type('html').send(PRIVACY_POLICY_HTML);
});

router.get('/support', (req, res) => {
    res.type('html').send(SUPPORT_HTML);
});

router.get('/terms', (req, res) => {
    res.type('html').send(PRIVACY_POLICY_HTML);
});

module.exports = router;
