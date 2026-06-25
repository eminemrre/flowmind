---
title: Mimari — Backend (Express + PostgreSQL)
type: mimari
tags: [flowmind, mimari, backend]
updated: 2026-06-25
---

# 🗄️ Backend — Express + PostgreSQL (VDS)

İlgili: [[mimari-genel]] · [[mimari-deployment]] · [[karar-defteri]]

## Stack

- **Node.js + Express** (`backend/server.js`)
- **PostgreSQL** (`backend/config/database.js`, `schema.sql`)
- **JWT** auth (`backend/middleware/auth.js`) + istemcide `expo-secure-store`
- **winston** structured logging (`backend/utils/logger.js`)
- **Docker** (`Dockerfile`, `docker-compose.yml`) + PM2
- Host: **VDS** (kendi sunucu) — `setup-vds.sh`

## API rotaları (`backend/routes/`)

| Rota | Sorumluluk | Bağlı özellik |
|---|---|---|
| `auth.js` | register / login / me | [[mimari-state-zustand]] |
| `tasks.js` | görev CRUD + complete | [[ozellik-gorev-yonetimi]] |
| `recurring.js` | tekrarlayan görevler | [[ozellik-gorev-yonetimi]] |
| `focus.js` | odak oturumları | [[ozellik-enerji-ve-odak]] |
| `energy.js` | enerji logları | [[ozellik-enerji-ve-odak]] |
| `stats.js` | istatistikler | [[ozellik-gamification]] |
| `achievements.js` | rozetler | [[ozellik-gamification]] |
| `preferences.js` | kullanıcı tercihleri | |
| `legal.js` | /privacy /terms /support | [[mimari-deployment]] |

## DB şeması (`config/schema.sql`)

`users`, `tasks`, `focus_sessions`, `energy_logs`, `achievements`, `subscriptions`

## Test

`backend/__tests__/` → auth, tasks, achievements, simple (Jest)

## Bağlantı

İstemci `lib/api.ts` → `config.api.baseUrl` üzerinden REST. Bearer JWT.
> ⚠️ Ayrıca `@supabase/supabase-js` bağımlılığı var ama bu backend Express.
> Çift backend mi, ölü bağımlılık mı? → [[karar-defteri]]
