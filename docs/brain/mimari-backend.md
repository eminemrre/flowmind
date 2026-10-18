---
title: Mimari — Backend (Express + PostgreSQL)
type: mimari
tags: [flowmind, mimari, backend]
updated: 2026-10-18
---

# 🗄️ Backend — Express + PostgreSQL (VDS)

İlgili: [[mimari-genel]] · [[mimari-deployment]] · [[mimari-ai]] · [[yayin-engelleri]]

## Stack

- **Node.js + Express** (`backend/server.js`) — `helmet`, `cors`, JSON body limit 1 MB
- **PostgreSQL** (`backend/config/database.js`, `config/schema.sql`)
- **JWT** auth (`middleware/auth.js`) + istemcide `expo-secure-store`
- **winston** logging (`utils/logger.js`) — konsol + `logs/all.log`, `logs/error.log`
- **Docker** (`Dockerfile`, `docker-compose.yml`) ve VDS üzerinde PM2 (`setup-vds.sh`)
- Rate limit: `/api` için IP başına 15 dakikada 100, `/api/auth` için 10 istek
  (bellekte `Map` — restart'ta sıfırlanır, tek instance varsayımı)

## API rotaları (`backend/routes/`)

| Rota | Sorumluluk | Bağlı |
|---|---|---|
| `auth.js` | register / login / me / profile / logout / **account (DELETE)** | [[mimari-state-zustand]] |
| `tasks.js` | görev CRUD + complete | [[ozellik-gorev-yonetimi]] |
| `recurring.js` | tekrarlayan görevler | [[ozellik-gorev-yonetimi]] |
| `focus.js` | odak oturumları | [[ozellik-enerji-ve-odak]] |
| `energy.js` | enerji logları | [[ozellik-enerji-ve-odak]] |
| `stats.js` | istatistikler | [[ozellik-gamification]] |
| `achievements.js` | rozetler | [[ozellik-gamification]] |
| `preferences.js` | kullanıcı tercihleri | |
| `ai.js` | OpenRouter proxy (`POST /chat`, auth korumalı) | [[mimari-ai]] |
| `legal.js` | `/privacy`, `/terms`, `/support` (içerik `backend/legal-content.js`) | [[yayin-engelleri]] |

✅ **Hesap silme eklendi** (2026-10-18): `DELETE /api/auth/account` — auth korumalı,
parola onaylı; şemadaki `ON DELETE CASCADE` sayesinde tek `DELETE FROM users WHERE id=$1`
görevleri, odak oturumlarını, enerji kayıtlarını, başarımları, tercihleri ve aboneliği
birlikte siler (gerçek Postgres motorunda doğrulandı). Apple 5.1.1(v) → [[yayin-engelleri]] E1

## DB şeması (`config/schema.sql`)

`users`, `tasks`, `focus_sessions`, `energy_logs`, `achievements`, `subscriptions`

- `subscriptions` tablosu var ama **hiçbir rota onu okumuyor/yazmıyor** — şu an ölü.
  Uygulamada uygulama içi satın alma ya da abonelik yok.
- `constants/config.ts` içindeki `freeTier` limitleri (10 görev/gün, 5 AI isteği/gün)
  tanımlı ama **hiçbir yerde uygulanmıyor** — kullanılmıyorsa kaldırılmalı.

## Test

`backend/__tests__/` → auth, tasks, achievements, simple (Jest + supertest).
PostgreSQL gerektirir; `npm test` backend dizininde çalışır.

## Yerel çalıştırma

```bash
cd backend && npm install
cp .env.example .env      # DATABASE_URL, JWT_SECRET, OPENROUTER_API_KEY
createdb flowmind && psql flowmind < config/schema.sql
npm start                 # http://localhost:3000
```

Sağlık kontrolü: `GET /api/health` → `{"status":"ok"}`. Legal sayfalar DB
gerektirmez; sunucu veritabanı olmadan da ayağa kalkar ve `/privacy` döner
(2026-10-18'de doğrulandı).
