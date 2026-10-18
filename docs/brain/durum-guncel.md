---
title: Güncel Durum — Nerede Kaldık
type: durum
tags: [flowmind, durum]
updated: 2026-10-18
---

# 📍 Güncel Durum — Nerede Kaldık?

İlgili: [[00-FlowMind-MOC]] · [[gelisim-fazlari]] · [[sonraki-adimlar]] · [[yayin-engelleri]]

## 🟢 Son commit

`5f38d49 Merge feature/premium-ui: premium UI + yeni logo + Faz A sağlamlaştırma`
(25 Haziran 2026)

Yerel ve `origin/main` aynı. Açık PR/issue yok, başka branch yok.

## 🧊 2026-10-18 — 4 ay sonra ilk analiz

Proje 2026-06-25'ten beri dokunulmamış. Repo analiz edildi, aşağıdakiler
**doğrulandı** (varsayım değil, çalıştırılarak):

| Kontrol | Sonuç |
|---|---|
| `npx tsc --noEmit` | ✅ temiz |
| `npx expo-doctor` | ✅ 17/18 (2 patch sürüm geride: `expo`, `expo-constants`) |
| `expo config --type introspect` | ✅ `UIBackgroundModes: ['fetch']` kurulu — arka plan sayacı iOS'ta çalışır |
| AI anahtarı | ✅ yalnız sunucuda (`backend/routes/ai.js`, `auth` korumalı) |
| `GET /privacy /terms /support` | ✅ üçü de doğru içerikle 200 dönüyor |
| `DELETE /api/auth/account` | ✅ token yok → 401, parola yok → 400 |
| `npm test` (kök) | ❌ `jest: command not found` → [[yayin-engelleri]] E6 |
| Backend testleri | ❌ `/api` ön eki eksikti, hepsi 404 → düzeltildi (E6) |
| `gh run list` | ❌ **son 12 CI koşusunun tamamı `failure`** → sebep E6 |
| Backend erişilebilirliği | ❌ timeout → [[yayin-engelleri]] E3 |

## 📌 Aynı gün kapatılan işler

**Legal/doküman:** legal metinler tek kaynağa indirildi (`backend/legal-content.js`
+ `npm run legal:sync`), `/terms` düzeltildi, README ve `docker-compose` hataları
giderildi, `setup-vds.sh` temizlendi, `docs/brain` güncellendi.

**Özellik:** uygulama içinden hesap silme eklendi (Apple 5.1.1(v)) —
`DELETE /api/auth/account`, `DeleteAccountModal`, store aksiyonu, testler ve
hukuki metin güncellemesi.

Ayrıntılı liste: [[yayin-engelleri]] → "kapatılanlar".

## ▶️ Sıradaki iş

[[yayin-engelleri]] — sırayla **E2 (legal URL host kararı)** ve **E3 (backend'i
ayağa kaldır)**. Ardından CI'ı yeşile çeviren E6 doğrulaması.
