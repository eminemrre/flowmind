<div align="center">

# 🧠 FlowMind

**AI-Powered Productivity Coach — Work With Your Energy, Not Against It**

The smart task manager that learns your biological rhythm and schedules your work when you'll actually get it done.

[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Why FlowMind](#-the-problem) · [Features](#-features) · [Quick Start](#-quick-start) · [Tech Stack](#-tech-stack) · [Roadmap](#-roadmap)

</div>

---

## 🎯 The Problem

**Traditional to-do apps set you up to fail.**

They treat you like a machine — but you're not. Your productivity follows a biological curve:

| Time | Energy | Typical App | FlowMind |
|------|--------|-------------|----------|
| 🌅 Morning | ⚡ High | Random tasks | Deep work |
| 🌤 Afternoon | 😐 Medium | Still random | Meetings & communication |
| 🌙 Evening | 😴 Low | Same list | Light tasks & planning |

> **72% of people say they work on the wrong tasks at the wrong time.** FlowMind fixes this.

---

## 💡 How It Works

```
1. Log your energy level (takes 5 seconds)
           ↓
2. AI learns your patterns over time
           ↓
3. Tasks are auto-prioritized for NOW
           ↓
4. Focus Mode helps you execute
           ↓
5. You get more done with less burnout
```

---

## ✨ Features

### 🌅 Smart Daily Planning
AI analyzes your personal energy patterns and schedules tasks when you're most likely to succeed. Morning person? Your hardest tasks go first. Night owl? FlowMind adapts.

### 🎯 Focus Mode (Pomodoro+)
Enhanced Pomodoro timer built for real productivity:
- ⏱ Customizable work/break intervals
- 📊 Session tracking with detailed statistics
- 💡 AI-powered break suggestions based on fatigue levels
- 🔔 Smart notifications that respect your flow state

### 📊 Energy Tracking
- Log energy levels (1-5) throughout the day in one tap
- Visualize trends over 7 and 30 days with interactive charts
- Identify your personal peak performance hours
- Correlate energy with task completion to find your optimal rhythm

### 🏆 Gamification
Stay motivated with a progression system:
- ⭐ Earn XP for completing tasks and focus sessions
- 📈 Level up system with escalating challenges
- 🏅 Achievement badges for milestones
- 🔥 Daily streaks with animated fire effects

### 🤖 AI-Powered Insights
Powered by Google Gemma 3 via OpenRouter:
- 🧠 Personalized daily motivational insights
- 📋 Intelligent task prioritization based on your energy
- 💡 Context-aware productivity tips that evolve with you

---

## 📱 Platform Support

| Platform | Status |
|----------|--------|
| 📱 iOS | ✅ Ready (Expo) |
| 🤖 Android | ✅ Ready (Expo) |
| 🌐 Web | ✅ Ready (Expo Web) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator / Android Emulator / Physical Device

### Installation

```bash
# Clone the repository
git clone https://github.com/eminemre35/flowmind.git
cd flowmind

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start development server
npx expo start --tunnel
```

Then scan the QR code with Expo Go (iOS/Android) or press `w` for web.

### Environment Variables

```env
# AI Engine (get free key at openrouter.ai)
EXPO_PUBLIC_OPENROUTER_API_KEY=your_key_here

# Backend API URL (for self-hosted backend)
EXPO_PUBLIC_API_BASE_URL=http://your-server:3000/api
```

### Backend Setup

```bash
cd backend

# Install backend dependencies
npm install

# Setup PostgreSQL database
createdb flowmind
psql flowmind < config/schema.sql

# Start the API server
npm start
```

---

## 🛠 Tech Stack

### Mobile App
| Technology | Purpose |
|------------|---------|
| **React Native 0.76** | Cross-platform mobile framework |
| **Expo SDK 52** | Development toolchain & OTA updates |
| **TypeScript 5.7** | Type safety across the codebase |
| **Expo Router** | File-based navigation (like Next.js) |
| **Zustand** | Lightweight state management |
| **React Native Reanimated** | 60fps animations |
| **React Native Chart Kit** | Energy trend visualizations |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | RESTful API server |
| **PostgreSQL** | Primary database |
| **JWT + SecureStore** | Authentication & token storage |
| **PM2** | Production process management |

### AI
| Technology | Purpose |
|------------|---------|
| **OpenRouter API** | LLM gateway |
| **Google Gemma 3** | Energy pattern analysis & insights |

---

## 📂 Project Structure

```
flowmind/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, Register
│   ├── (onboarding)/       # Welcome flow
│   ├── (tabs)/             # Main tab screens
│   │   ├── index.tsx       # Today (Smart Planning)
│   │   ├── tasks.tsx       # Task Management
│   │   ├── focus.tsx       # Focus Mode (Pomodoro)
│   │   └── stats.tsx       # Statistics & Trends
│   └── _layout.tsx         # Root layout
├── components/             # Reusable UI components
│   └── ui/                 # Button, TaskCard, EnergySlider
├── constants/              # Theme, colors, config
├── hooks/                  # Custom hooks
├── lib/                    # API client, AI service
├── stores/                 # Zustand state stores
├── types/                  # TypeScript type definitions
├── backend/                # Express.js API
│   ├── config/             # Database schema
│   ├── routes/             # API endpoints
│   └── server.js           # Entry point
└── __tests__/              # Unit tests
```

---

## 🗺 Roadmap

### ✅ Completed
- [x] Core UI with tab navigation
- [x] Authentication (Register/Login/JWT)
- [x] Onboarding wizard
- [x] Backend API + VDS deployment
- [x] OpenRouter AI integration
- [x] Energy tracking with visualizations
- [x] Focus Mode (Pomodoro timer)
- [x] Gamification (XP, levels, streaks)

### 🔄 In Progress
- [ ] Task CRUD with backend sync
- [ ] AI-driven daily planning algorithm
- [ ] Push notifications

### 📋 Planned
- [ ] Offline-first with background sync
- [ ] Calendar integration
- [ ] Team/group productivity features
- [ ] Apple Health / Google Fit integration
- [ ] App Store & Play Store release

---

## 🤝 Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Work smarter, not harder. Let AI match your tasks to your energy.**

⭐ Star this repo if you believe productivity should respect biology!

Made with 🧠 and ☕

</div>
