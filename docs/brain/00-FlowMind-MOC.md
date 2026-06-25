---
title: FlowMind — Beyin Haritası (MOC)
type: moc
tags: [flowmind, harita, moc]
updated: 2026-06-25
---

# 🧠 FlowMind — Beyin Haritası

> Bu klasör bir **Obsidian vault**'tur. Obsidian'da `docs/brain` klasörünü aç,
> **Graph View**'ı (sol alt grafik ikonu) açtığında notlar birbirine bağlı bir
> **sinir ağı** olarak görünür. Her not bir nöron, her `[[bağlantı]]` bir sinaps.

**FlowMind**, enerji ritmine göre görev planlayan AI destekli verimlilik uygulamasıdır.
*"Enerjine karşı değil, enerjinle çalış."*

---

## 🎯 Buradan Başla

- 📍 [[durum-guncel]] — **Şu an neredeyiz?** (commit'lenmemiş premium UI redesign)
- 🗺️ [[gelisim-fazlari]] — Faz 1→10 zaman çizelgesi (git history)
- ➡️ [[sonraki-adimlar]] — Yapılacaklar

## 🏗️ Mimari Katmanlar

- [[mimari-genel]] — Sistem bütünü (tek sayfada)
- [[mimari-frontend]] — React Native + Expo
- [[mimari-backend]] — Express + PostgreSQL (VDS)
- [[mimari-ai]] — OpenRouter + Gemma
- [[mimari-state-zustand]] — Zustand store'lar
- [[mimari-deployment]] — EAS Build + App Store

## ✨ Özellikler

- [[ozellik-enerji-ve-odak]] — Enerji takibi + Pomodoro
- [[ozellik-gorev-yonetimi]] — Görev CRUD, takvim, tekrar
- [[ozellik-gamification]] — XP, seviye, streak, rozet
- [[ozellik-ai-oneriler]] — Günlük plan + sesli görev

## 🧰 Karar & Araçlar

- [[karar-defteri]] — Mimari kararlar + **çözülmemiş çelişkiler**
- [[arac-mcp]] — MCP entegrasyon analizi (ekle/kaldır)

---

## 🌐 Bağlantı Haritası (özet)

```
                    [00-MOC]
                       │
      ┌────────────────┼────────────────┐
 [durum-guncel]   [mimari-genel]   [gelisim-fazlari]
      │                │                  │
      │     ┌──────────┼──────────┐       │
      │  [frontend] [backend]  [ai]       │
      │     │          │         │        │
   [ozellik-*]◄────────┴─────────┘        │
      │                                    │
 [sonraki-adimlar]◄──────[karar-defteri]──┘
                              │
                          [arac-mcp]
```
