---
title: Araçlar — MCP & Skill Analizi
type: arac
tags: [flowmind, mcp, skill, tooling]
updated: 2026-06-25
---

# 🧰 MCP & Skill Analizi

İlgili: [[00-FlowMind-MOC]] · [[karar-defteri]] · [[sonraki-adimlar]]

> **Bağlam:** FlowMind = RN/Expo mobil + Express/Postgres backend. Aşağıdaki tablo
> `claude mcp list` health çıktısıyla (2026-06-25) doğrulandı. Ana sorun eksik
> araç değil, **araç gürültüsü ve ölü bağlantılar**.

## 📡 Gerçek durum (claude mcp list)

| MCP | Sağlık | Karar | Neden |
|---|---|---|---|
| ruflo | ✔ Connected | 🟡 Gözden geçir | 200+ tool yükü; çoğu kullanılmıyor |
| github (plugin) | ! tools fetch failed | 🟢 **Düzelt** | Çekirdek araç ama bozuk → re-auth |
| Turkish Airlines | ✔ | 🔴 Kaldır | Alakasız |
| Twilio | ✔ | 🔴 Kaldır | SMS; bildirim zaten expo-notifications |
| Canva | ✔ | 🔴 Kaldır | Tasarım; gerekmiyor |
| Notion | ✔ | 🔴 Kaldır | Bilgi tabanı artık [[00-FlowMind-MOC|docs/brain]] |
| chrome-devtools | ✘ Failed | 🔴 Kaldır | Bağlanamıyor, her oturum deneniyor |
| playwright (plugin) | ✘ Failed | 🔴 Kaldır/düzelt | Web test; mobilde marjinal |
| qdrant | ✘ Failed | 🔴 Kaldır | Vektör DB; projede kullanılmıyor |
| fakechat (plugin) | ✘ Failed | 🔴 Kaldır | Demo MCP |
| aikido (plugin) | ✘ Failed | 🔴 Kaldır | Güvenlik tarama; ayrı çalıştır |
| context7 (plugin) | ✘ Failed | ⚪ Düzelt (ops.) | Dök çekme — faydalı olabilir |
| Shopify | ✘ Failed | 🔴 Kaldır | E-ticaret; alakasız |

## ⚪ Auth bekliyor (bağlı değil) — sadece gerekirse bağla

- **Supabase, Vercel, Sentry, Figma** → bu proje için *potansiyel* faydalı
  (Supabase ölü-dep ise gereksiz → [[karar-defteri]]; Sentry App Store sonrası crash takibi → [[mimari-deployment]]).
- Geri kalan onlarca (IBKR, Semrush, Slack, Atlassian, Adobe x4, Meta Ads, Linear,
  SketchUp, Higgsfield, Windsor, Google Drive) → **alakasız**, yok say.

## 🛠️ Kaldırma — 3 mekanizma

```bash
# 1) Doğrudan MCP server'lar (çalışmayanlar):
claude mcp remove qdrant
claude mcp remove chrome-devtools

# 2) ruflo (kullanmıyorsan):
claude mcp remove ruflo
```

**3) Plugin'ler** → `/plugin` menüsü:
- Disable: `fakechat`, `aikido`, (kullanmıyorsan `playwright`)
- Düzelt/koru: `github` (re-auth), `context7`

**4) claude.ai Connector'ları** → claude.ai web → **Settings → Connectors → Disconnect**:
- Turkish Airlines, Twilio, Canva, Notion, Shopify

> ⚠️ Connector'lar CLI'dan (`claude mcp remove`) kalkmaz — claude.ai hesabına bağlı.

## 🎯 Tutulacak minimal set

**github** (düzeltilince) + **ruflo** (kullanılıyorsa) + gerekirse **context7**.
Gerisi gürültü. Önce kaldır, ihtiyaç doğdukça ekle.

## 🎯 İş için doğrudan faydalı Skill'ler

| Skill | Ne zaman |
|---|---|
| `ui-ux-pro-max` | Premium UI redesign — uygulandı → [[durum-guncel]] |
| `frontend-design` | Görsel kimlik / tipografi yönü |
| `karpathy-guidelines` | Kodlama disiplini (yüklü) |
| `code-review` / `security-review` | Submission öncesi denetim |
| `verify` | Değişiklik gerçekten çalışıyor mu |
| `commit` | Temiz commit'ler |
