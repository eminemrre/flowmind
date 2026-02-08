// API Configuration
export const config = {
    // OpenRouter AI (Free models)
    openrouter: {
        apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '',
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
    },

    // VDS Backend
    api: {
        baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    },

    // App Settings
    app: {
        name: 'FlowMind',
        version: '1.0.0',
        defaultPomodoroMinutes: 25,
        defaultBreakMinutes: 5,
        longBreakMinutes: 15,
        sessionsUntilLongBreak: 4,
    },

    // Gamification
    xp: {
        taskComplete: 10,
        focusSessionComplete: 25,
        dailyStreakBonus: 50,
        levelUpThreshold: 100,
    },

    // Free tier limits
    freeTier: {
        maxDailyTasks: 10,
        maxDailyAIRequests: 5,
        maxStreakDays: 30,
    },
} as const;

export type Config = typeof config;
