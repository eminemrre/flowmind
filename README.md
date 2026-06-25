<div align="center">

# FlowMind

**AI productivity coach that schedules work around your real energy patterns.**

[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

[Overview](#overview) · [Key Features](#key-features) · [Architecture](#architecture-and-tech-stack) · [Quick Start](#quick-start) · [Deployment Status](#deployment-status) · [Roadmap](#roadmap)

</div>

---

## Overview

FlowMind is a cross-platform productivity app for people who do not perform at the same energy level all day.

Instead of keeping a flat task list, FlowMind combines:

- energy tracking,
- focus sessions,
- AI-assisted planning,
- and habit reinforcement,

to help users choose the right task at the right time.

## Key Features

- Energy-aware daily planning
: Prioritizes tasks based on current and historical energy patterns.

- Focus Mode (Pomodoro+)
: Supports structured work/break sessions with session tracking.

- Energy analytics
: Tracks trends across recent days to reveal personal peak windows.

- Gamification loops
: XP, levels, streaks, and achievements for consistency.

- AI insights
: Generates planning suggestions and contextual productivity guidance.

## Architecture and Tech Stack

### Mobile App

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 |
| Runtime | Expo SDK 54 |
| Language | TypeScript 5.7 |
| Navigation | Expo Router |
| State | Zustand |
| Charts | React Native Chart Kit |

### Backend API

| Layer | Technology |
|---|---|
| Server | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT + Secure Store (client side) |
| Process | PM2 |

### AI Layer

| Layer | Technology |
|---|---|
| LLM Gateway | OpenRouter |
| Model Family | Gemma-class models (configurable) |

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Expo CLI via `npx expo`
- iOS Simulator, Android Emulator, or a physical device

### 1) Clone and install

```bash
git clone https://github.com/eminemrre/flowmind.git
cd flowmind
npm install --legacy-peer-deps
```

### 2) Configure environment

```bash
cp .env.example .env
```

Required variables:

```env
EXPO_PUBLIC_OPENROUTER_API_KEY=your_key_here
EXPO_PUBLIC_API_BASE_URL=http://your-server:3000/api
```

### 3) Start the app

```bash
npx expo start --tunnel
```

Use Expo Go on mobile or press `w` for web.

### 4) Optional backend setup

```bash
cd backend
npm install
createdb flowmind
psql flowmind < config/schema.sql
npm start
```

## Deployment Status

| Target | Status | Notes |
|---|---|---|
| iOS (Expo) | Ready | Runs through Expo workflow |
| Android (Expo) | Ready | Runs through Expo workflow |
| Web (Expo Web) | Ready | Useful for demos and QA |
| Backend API | Self-hosted | Node + PostgreSQL deployment |

## Roadmap

- Canonical roadmap: [ROADMAP.md](ROADMAP.md)
- In progress: task sync hardening, daily planning algorithm improvements, push notifications
- Planned: offline sync improvements, calendar integration, health platform integrations

## Contributing

Contributions are welcome.

1. Open an issue to discuss larger changes.
2. Fork the repo and create a feature branch.
3. Commit with clear messages.
4. Open a pull request with context and test notes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

---

<div align="center">

Build around your real rhythm, not an idealized schedule.

</div>
