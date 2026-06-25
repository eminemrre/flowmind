---
title: Araçlar — MCP & Skill Analizi
type: arac
tags: [flowmind, mcp, skill, tooling]
updated: 2026-06-25
---

# 🧰 MCP & Skill Analizi

İlgili: [[00-FlowMind-MOC]] · [[karar-defteri]] · [[sonraki-adimlar]]

> **Bağlam:** FlowMind = RN/Expo mobil + Express/Postgres backend. MCP'ler bu
> bağlama göre değerlendirildi. Ana sorun eksik araç değil, **araç gürültüsü**.

## 🔴 Kaldır (bu projeyle alakasız — context yükü)

| MCP | Neden |
|---|---|
| **Shopify** | E-ticaret; projeyle ilgisiz |
| **Turkish Airlines** | Uçuş; tamamen ilgisiz |
| **Twilio** | SMS/iletişim; bildirim zaten `expo-notifications` |
| **Canva** | Tasarım; App Store görseli için bile zorlama |
| **Notion** | Bilgi tabanı artık bu Obsidian vault → [[00-FlowMind-MOC]] |
| **fakechat** | Demo/test MCP'si |

## 🟡 ruflo — gözden geçir (en büyük yük)

- **200+ tool** yüklüyor: swarm, neural, wasm, hive-mind, daa, embeddings, autopilot…
- Bu ölçekte bir uygulama için **aşırı** (overkill). Her oturumda token + araç-seçim
  karmaşası getiriyor.
- **[Olası]** Tek gerçek faydası `memory_*` ve belki `hooks_*`. Geri kalan kullanılmıyor.
- **Öneri:** Ya tamamen kaldır, ya da yalnızca memory alt kümesine indir.
  (Kalıcı hafıza zaten Claude Code'un kendi `memory/` mekanizmasıyla da sağlanıyor.)

## 🟢 Tut (gerçekten faydalı)

| MCP | Neden |
|---|---|
| **github** | Kod, PR, issue, release — çekirdek iş akışı |
| **chrome-devtools** *veya* **playwright** | **Birini seç.** Expo web + backend legal sayfaları (`/privacy /terms /support`) debug/test. İkisi birden gereksiz |

## ⚪ Eklemeyi değerlendir (şart değil)

- **Context7 (doküman MCP)** — Expo/RN/React 19 hızlı değişiyor; güncel API çekmek faydalı
- **Sentry MCP** — App Store'a çıkınca crash/error takibi → [[mimari-deployment]]
- **Supabase MCP** — *yalnızca* Supabase gerçekten kullanılacaksa → [[karar-defteri]] (muhtemelen değil)

> Net tavsiye: önce **kaldır**, sonra ihtiyaç doğdukça ekle. Boş araç ekleme.

## 🎯 İş için doğrudan faydalı Skill'ler

| Skill | Ne zaman |
|---|---|
| `ui-ux-pro-max` | Premium UI redesign — **şu an WIP** → [[durum-guncel]] |
| `frontend-design` | Görsel kimlik / tipografi yönü |
| `karpathy-guidelines` | Kodlama disiplini (yüklü) |
| `code-review` / `security-review` | Submission öncesi denetim |
| `verify` | Değişiklik gerçekten çalışıyor mu |
| `commit` | Temiz commit'ler (WIP'i kaydet!) |

## Komutlar (kaldırma)

```bash
claude mcp list                 # mevcut durumu gör
claude mcp remove <isim>        # global tanımlıysa böyle
```
