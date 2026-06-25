---
title: Sonraki Adımlar
type: plan
tags: [flowmind, plan, todo]
updated: 2026-06-25
---

# ➡️ Sonraki Adımlar

İlgili: [[00-FlowMind-MOC]] · [[durum-guncel]] · [[karar-defteri]] · [[arac-mcp]]

## 🔥 Acil (bu hafta)

1. **WIP'i kaydet** — premium UI redesign commit'lenmemiş, kaybolabilir → [[durum-guncel]]
   ```bash
   git switch -c feature/premium-ui && git add -A && git commit -m "wip: premium glassmorphism redesign"
   ```
2. **Redesign'ı yay** — login/register/focus bitti; tasks, stats, profile, index, calendar tutarlı hale gelsin (`ui-ux-pro-max` skill) → [[mimari-frontend]]
3. **Eskimiş dökümanları düzelt** — `ROADMAP.md` + `README.md` sürümleri → [[karar-defteri]]

## 🧹 Temizlik

4. **Supabase netleştir** — kullanılmıyorsa `npm rm @supabase/supabase-js` → [[karar-defteri]]
5. **MCP temizliği** — alakasızları kaldır, ruflo'yu gözden geçir → [[arac-mcp]]
6. **AI anahtarı** — istemcide ifşa riski; backend proxy değerlendir → [[mimari-ai]]

## 🚀 Lansman (App Store)

7. Screenshot'lar (iPhone 6.7"/6.5", Android) — `.agent/workflows/publish-app.md`
8. `code-review` + `security-review` → production build → `eas submit` → [[mimari-deployment]]

## 🧪 Sağlamlaştırma (opsiyonel)

9. Store test kapsamını genişlet (taskStore, settingsStore) → [[mimari-state-zustand]]
10. AI prompt kalitesi ölç/iyileştir → [[ozellik-ai-oneriler]]

---

> Bu not yaşayan bir liste. Tamamlananları işaretle, [[gelisim-fazlari]]'na taşı.
