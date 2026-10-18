---
title: FlowMind — Beyin Haritası (MOC)
type: moc
tags: [flowmind, harita, moc]
updated: 2026-10-18
---

# 🧠 FlowMind — Beyin Haritası

> Bu klasör bir **Obsidian vault**'tur. Obsidian'da `docs/brain` klasörünü aç,
> **Graph View**'ı (sol alt grafik ikonu) açtığında notlar birbirine bağlı bir
> **sinir ağı** olarak görünür. Her not bir nöron, her `[[bağlantı]]` bir sinaps.

**FlowMind**, enerji ritmine göre görev planlayan AI destekli verimlilik uygulamasıdır.
*"Enerjinle çalış, enerjine karşı değil."*

---

## 🎯 Buradan Başla

- 🚧 [[yayin-engelleri]] — **Yayına çıkmadan önce kapatılması gerekenler** (önce buraya bak)
- 📍 [[durum-guncel]] — Şu an neredeyiz?
- 🗺️ [[gelisim-fazlari]] — Faz 1→15 zaman çizelgesi (git history)
- ➡️ [[sonraki-adimlar]] — Yayın yol haritası (FAZ A→D)

## 🏗️ Mimari Katmanlar

- [[mimari-genel]] — Sistem bütünü (tek sayfada)
- [[mimari-frontend]] — React Native + Expo
- [[mimari-backend]] — Express + PostgreSQL (VDS)
- [[mimari-ai]] — Backend proxy → OpenRouter + Gemma
- [[mimari-state-zustand]] — Zustand store'lar
- [[mimari-deployment]] — EAS Build + App Store

## ✨ Özellikler

- [[ozellik-enerji-ve-odak]] — Enerji takibi + Pomodoro
- [[ozellik-gorev-yonetimi]] — Görev CRUD, takvim, tekrar
- [[ozellik-gamification]] — XP, seviye, streak, rozet
- [[ozellik-ai-oneriler]] — Günlük plan + doğal dille görev

## 🧰 Karar & Araçlar

- [[karar-defteri]] — Mimari kararlar + karar bekleyenler
- [[arac-mcp]] — MCP entegrasyon analizi (ekle/kaldır)

---

## 🌐 Bağlantı Haritası (özet)

```
                 [00-MOC]
                    │
     ┌──────────────┼───────────────┐
[yayin-engelleri] [durum-guncel] [gelisim-fazlari]
     │               │                │
     │        ┌──────┼───────┐        │
     │   [frontend][backend][ai]      │
     │        │      │      │         │
     │   [ozellik-*]─┴──────┘         │
     │                                │
[sonraki-adimlar]◄────[karar-defteri]─┘
                            │
                        [arac-mcp]
```

## 🔗 İlgili dış notlar

- `.agent/workflows/publish-app.md` — adım adım yayın rehberi
- `ROADMAP.md` (repo kökü) — özet faz tablosu
- `docs/store-description.md` — mağaza metinleri (⚠️ "sesli görev" iddiası düzeltilmeli)
