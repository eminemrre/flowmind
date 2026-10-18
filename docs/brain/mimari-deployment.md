---
title: Mimari — Deployment (EAS + App Store)
type: mimari
tags: [flowmind, mimari, deployment, appstore]
updated: 2026-10-18
---

# 🚀 Deployment — EAS Build + App Store

İlgili: [[mimari-genel]] · [[mimari-backend]] · [[sonraki-adimlar]] · [[yayin-engelleri]]

## Pipeline

- **EAS Build** (cloud) — `eas.json`, Mac gerektirmez
- **App Store Connect** — `ascAppId: 6772716526`, Apple ID `eminemrre@icloud.com`,
  team ID `XZ44PJW5ZA` (hepsi `eas.json` içinde pinli)
- **Bundle ID: `com.eminemre.flowmind`** (hem iOS hem Android — `app.json`'dan doğrulandı)
  > ⚠️ Eski notlarda `com.flowmind.app` yazıyordu; gerçek değer bu değil. Değiştirilirse
  > App Store Connect'teki uygulamayla eşleşmez.
- iOS `buildNumber: 2`, `autoIncrement: true` (production profili)
- Detaylı rehber: `.agent/workflows/publish-app.md`

## Legal sayfalar

Kaynak: `backend/legal-content.js` → `/privacy`, `/terms`, `/support` rotaları
(`backend/routes/legal.js`). `web/*.html` kopyaları `npm run legal:sync` ile üretilir.

⚠️ **Yayınlanmış bir URL henüz yok.** Backend erişilemez durumda ve `flowmind.app`
domaini çözülmüyor. Mağaza incelemesi için çalışan URL şart → [[yayin-engelleri]] E2.

## Backend dağıtımı — çelişki çözülmedi

Üç kaynak farklı şey söylüyor (bkz. [[yayin-engelleri]] E7):

| Kaynak | Söylediği |
|---|---|
| `.github/workflows/ci.yml` | `/opt/flowmind/backend` + `pm2 restart flowmind-api` |
| `backend/setup-vds.sh` | `/var/www/flowmind` (repo adresi ve sabit parola 2026-10-18'de düzeltildi) |
| `docker-compose.yml` | `flowmind-api` + `db` container'ları |

CI'daki `deploy-backend` job'ı `VDS_HOST` / `VDS_USER` / `VDS_KEY` secret'larına bağlı.

## Durum

Kod tarafı submission'a hazır; sıra mağaza kabuğunda → [[sonraki-adimlar]] FAZ B.
