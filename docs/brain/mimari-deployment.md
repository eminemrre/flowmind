---
title: Mimari — Deployment (EAS + App Store)
type: mimari
tags: [flowmind, mimari, deployment, appstore]
updated: 2026-06-25
---

# 🚀 Deployment — EAS Build + App Store

İlgili: [[mimari-genel]] · [[mimari-backend]] · [[sonraki-adimlar]]

## Pipeline

- **EAS Build** (cloud) — `eas.json`, Mac gerektirmez
- **App Store Connect** — `ascAppId: 6772716526` pinli, Apple ID `eminemrre@icloud.com`
- **Bundle ID:** `com.flowmind.app` (iOS + Android)
- `autoIncrement: true` (boolean — son commit'te düzeltildi)
- Detaylı rehber: `.agent/workflows/publish-app.md`

## Legal (App Store şartı)

Backend `routes/legal.js` → `/privacy`, `/terms`, `/support` sayfaları
(submission için zorunlu). Mağaza metni: `docs/store-description.md`.

## Durum

Git history "submission hazırlığı" aşamasında → [[durum-guncel]].
İkon, splash, favicon gerçek PNG'lerle değiştirildi; expo-doctor uyarıları
ve TypeScript hataları temizlendi.

## Kalan submission işleri

- [ ] Screenshot'lar (iPhone 6.7"/6.5", Android) — bkz. publish-app.md
- [ ] Premium UI redesign'ı bitir → [[durum-guncel]]
- [ ] Production build + `eas submit`
→ tümü [[sonraki-adimlar]]
