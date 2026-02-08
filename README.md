# FlowMind AI 🧠

AI destekli kişisel verimlilik koçu. Enerji seviyenize göre görevlerinizi optimize eder.

## ✨ Özellikler

- 🎯 **Pomodoro Timer** - Odaklanma seansları
- 🤖 **AI Önerileri** - OpenRouter ile akıllı planlama
- ⚡ **Enerji Takibi** - Günlük enerji seviyesi
- 🏆 **Gamification** - XP ve seviye sistemi
- 📊 **İstatistikler** - Verimlilik analizi

## 🚀 Kurulum

```bash
# Bağımlılıkları kur
npm install

# .env dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle ve API key'lerini ekle

# Uygulamayı başlat
npm start
```

## 📱 Teknolojiler

- React Native + Expo
- TypeScript
- Zustand (State Management)
- OpenRouter AI
- Expo Router

## 📁 Proje Yapısı

```
flowmind/
├── app/                 # Ekranlar (Expo Router)
│   ├── (tabs)/         # Tab navigation
│   ├── (auth)/         # Login, Register
│   └── (onboarding)/   # Onboarding flow
├── components/         # UI Components
├── constants/          # Theme, Config
├── lib/                # API, AI services
├── stores/             # Zustand stores
└── types/              # TypeScript types
```

## 🔒 Güvenlik

API key'ler `.env` dosyasında saklanır ve `.gitignore` ile gizlenir.

## 📄 Lisans

MIT
