---
title: Özellik — AI Öneriler & Doğal Dille Görev
type: ozellik
tags: [flowmind, ozellik, ai]
updated: 2026-10-18
---

# 💡 AI Öneriler & Doğal Dille Görev

İlgili: [[mimari-ai]] · [[ozellik-enerji-ve-odak]] · [[ozellik-gorev-yonetimi]] · [[yayin-engelleri]]

## Yetenekler

- **Günlük AI plan/öneri** — Today ekranında (`app/(tabs)/index.tsx`)
- **Enerji bazlı planlama** — AI, enerji seviyesini ve peak saatleri girdi alır → [[ozellik-enerji-ve-odak]]
- **Haftalık performans raporu** ve **motivasyon mesajı**
- **Görev analizi** — süre/enerji/öncelik yorumu
- **Doğal dille görev ekleme** — `components/VoiceTaskButton.tsx`
- **Lojik zamanlama** (`getScheduleSuggestion`) — AI'sız, yerel algoritma

## ⚠️ "Sesli görev" gerçekte sesli değil

`VoiceTaskButton` bir **mikrofon ikonu** gösterir ve "🎙️ Sesli Görev Ekle" başlıklı
bir **metin kutusu** açar. Konuşma tanıma yok, mikrofon izni istenmez, ses kaydı
alınmaz. Yapılan iş: kullanıcının yazdığı doğal dil metnini AI ile
yapılandırılmış göreve çevirmek.

Sonuçları:
- Mağaza metni ve README "voice-to-task" diyorsa bu **yanıltıcı metadata** olur → [[yayin-engelleri]] E4
- Gizlilik politikasında mikrofon/`NSMicrophoneUsageDescription` **gerekmez** (istenmediği için)

## Teknik

- `lib/ai.ts` → backend proxy → OpenRouter → Gemma → [[mimari-ai]]
- `lib/aiCache.ts` ile maliyet/gecikme azaltma (günlük 15 dk, haftalık 1 saat)
- Hata durumunda statik fallback — uygulama çökmez

## Açık konular

- ✅ "AI anahtarı nerede?" sorusu kapandı: sunucuda → [[karar-defteri]]
- ❌ Üretim modeli hâlâ ücretsiz tier → [[yayin-engelleri]] E5
- ❌ Gerçek ses girişi eklenecek mi, metin mi düzeltilecek? → [[karar-defteri]] "Karar bekleyenler"
- ❌ Prompt kalitesi ölçülmedi (çıktı örnekleri toplanmadı)
