# 🧠 FlowMind AI

<div align="center">

**AI-Powered Productivity Coach for Peak Performance**

[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-black?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Roadmap](#-roadmap)

</div>

---

## 🎯 Problem

**Traditional to-do apps fail because they ignore human biology.**

- 📉 Energy levels fluctuate throughout the day
- � Willpower is a limited resource
- ⏰ Working against your natural rhythm = burnout
- 📋 Static task lists don't adapt to how you feel

## 💡 Solution

**FlowMind uses AI to match your tasks with your energy levels.**

Instead of forcing you to work on demanding tasks when you're exhausted, FlowMind:

1. **Tracks your energy** throughout the day
2. **Learns your patterns** (morning person? night owl?)
3. **Suggests optimal times** for each task type
4. **Adapts in real-time** based on how you feel right now

---

## ✨ Features

### 🌅 Smart Daily Planning
AI analyzes your energy patterns and schedules tasks when you're most likely to succeed.

### 🎯 Focus Mode (Pomodoro+)
Enhanced Pomodoro timer with:
- Customizable work/break intervals
- Session tracking & statistics
- Break suggestions based on fatigue

### 📊 Energy Tracking
- Log your energy level (1-5) throughout the day
- Visual trends over 7/30 days
- Identify your peak performance hours

### 🏆 Gamification
- XP for completing tasks & focus sessions
- Level up system
- Achievement badges
- Daily streaks with fire animations

### 🤖 AI-Powered Insights
Powered by OpenRouter (Google Gemma 3):
- Daily motivational insights
- Task prioritization suggestions
- Personalized productivity tips

---

## 📱 Screenshots

| Today | Tasks | Focus | Stats |
|-------|-------|-------|-------|
| Coming Soon | Coming Soon | Coming Soon | Coming Soon |

---

## 🛠 Tech Stack

### Frontend
- **React Native** + **Expo** (SDK 52)
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Zustand** for state management
- **React Native Reanimated** for smooth animations

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** database
- **JWT** authentication
- **PM2** process manager

### AI
- **OpenRouter API** (Google Gemma 3 model)
- Free tier with fallback handling

---

## � Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Physical Device

### Quick Start

```bash
# Clone the repository
git clone https://github.com/eminemre35/flowmind.git
cd flowmind

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start the development server
npx expo start --tunnel
```

### Environment Variables

```env
# OpenRouter AI (get free key at openrouter.ai)
EXPO_PUBLIC_OPENROUTER_API_KEY=your_key_here

# Backend API URL
EXPO_PUBLIC_API_BASE_URL=http://your-server:3000/api
```

---

## 📂 Project Structure

```
flowmind/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login, Register
│   ├── (onboarding)/      # Welcome flow
│   ├── (tabs)/            # Main tab screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   └── ui/               # Button, TaskCard, etc.
├── constants/            # Theme, config
├── lib/                  # API, AI services
├── stores/               # Zustand state
├── types/                # TypeScript types
├── backend/              # Express.js API
│   ├── config/          # Database schema
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
└── scripts/              # Utility scripts
```

---

## � Roadmap

### ✅ Completed
- [x] Core UI & Navigation
- [x] Authentication screens
- [x] Onboarding flow
- [x] Backend API setup
- [x] VDS deployment
- [x] OpenRouter AI integration

### 🔄 In Progress
- [ ] Task CRUD operations
- [ ] Backend API integration
- [ ] Focus timer enhancements

### 📋 Planned
- [ ] Statistics & charts
- [ ] Gamification system
- [ ] Dark mode
- [ ] Push notifications
- [ ] App Store release

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## � Author

**Emin Emre**
- GitHub: [@eminemre35](https://github.com/eminemre35)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and ☕

</div>
