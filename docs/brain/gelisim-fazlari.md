---
title: Gelişim Fazları — Zaman Çizelgesi
type: zaman-cizelgesi
tags: [flowmind, fazlar, history]
updated: 2026-10-18
---

# 🗺️ Gelişim Fazları (git history)

İlgili: [[00-FlowMind-MOC]] · [[durum-guncel]] · [[karar-defteri]] · [[yayin-engelleri]]

## Kronolojik zincir

1. **Temel** — RN+Expo kurulumu, Expo Router, tab/auth/onboarding ekranları,
   Zustand store, tema, OpenRouter client → [[mimari-frontend]]
2. **Backend** — Express + PostgreSQL API (VDS), JWT auth, AI test scripti → [[mimari-backend]]
3. **Faz 4.1** — Task CRUD ekranları, profesyonel README → [[ozellik-gorev-yonetimi]]
4. **Faz 5+6** — Polish & UX + Test & CI/CD
5. **Faz 6.5** — İstatistik grafikleri, AI cache, ErrorBoundary, Skeleton → [[mimari-ai]]
6. **Faz 7** — App Store lansman hazırlığı (icon, EAS, privacy, store desc)
7. **Faz 8** — Background timer, offline mode, scheduled notifications → [[ozellik-enerji-ve-odak]]
8. **Faz 9** — Doğal dille görev ekleme, takvim görünümü, tekrarlayan görevler → [[ozellik-ai-oneriler]]
9. **Faz 10** — Enerji trend grafiği + authStore/gamificationStore testleri → [[ozellik-gamification]]
10. **Altyapı** — Docker, winston logging, graceful shutdown; Expo SDK 54 yükseltme (RN 0.81, React 19, reanimated 4)
11. **Submission hazırlığı** — EAS init, gerçek ikon, ascAppId pin, legal sayfalar → [[mimari-deployment]]
12. **Premium UI** — cybermorphism tüm ekranlara, Girdap Küre ikonu, logo
13. **Faz A** — AI çağrıları backend proxy'sine, bağımlılık temizliği (25 Haziran 2026)
14. **🧊 Duraklama** — 25 Haziran → 18 Ekim 2026 (4 ay)
15. **▶ ŞİMDİ** — Legal/doküman sağlamlaştırma + yayın engellerinin kapatılması → [[yayin-engelleri]]

## Teknik kilometre taşları

- **Expo SDK 52 → 54** geçişi yapıldı (RN 0.76 → 0.81, React 18 → 19).
  README ve ROADMAP 2026-06-25'te güncellendi, artık doğru sürümleri yazıyor.
- Recurring routes bir ara MVP dışı bırakıldı, sonra Faz 9'da geri geldi.
- **Faz 9'daki "sesli görev" aslında ses değil**: mikrofon ikonlu bir metin girişi.
  Gerçek konuşma tanıma hiç eklenmedi → [[yayin-engelleri]] E4.
