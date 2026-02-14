// FlowMind Type Definitions

// ============ USER ============
export interface User {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    created_at: string;
    last_active_at: string;
    current_streak: number;
    total_xp: number;
    level: number;
}

export interface UserPreferences {
    id: string;
    userId: string;
    chronotype: 'morning' | 'evening' | 'intermediate';
    wakeTime: string; // HH:MM format
    sleepTime: string;
    peakStart: string;
    peakEnd: string;
    workHoursPerDay: number;
    healthConnected: boolean;
    notificationSettings: {
        dailyPlan: boolean;
        breaks: boolean;
        achievements: boolean;
    };
}

// ============ TASK ============
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    category: string;
    priority: Priority;
    energyLevel: EnergyLevel;
    estimatedMinutes: number;
    dueDate: string | null;
    scheduledTime: string | null;
    isCompleted: boolean;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    // Recurring task fields
    recurrence?: 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly' | null;
    recurrenceEndDate?: string | null;
    parentTaskId?: string | null;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    category?: string;
    priority?: Priority;
    energyLevel?: EnergyLevel;
    estimatedMinutes?: number;
    dueDate?: string;
    scheduledTime?: string;
    recurrence?: 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';
    recurrenceEndDate?: string;
}

// ============ ENERGY ============
export interface EnergyLog {
    id: string;
    userId: string;
    energyLevel: 1 | 2 | 3 | 4 | 5;
    loggedAt: string;
    source: 'manual' | 'health_kit' | 'predicted';
}

// ============ FOCUS SESSION ============
export interface FocusSession {
    id: string;
    userId: string;
    taskId: string | null;
    durationMinutes: number;
    breaksTaken: number;
    startedAt: string;
    endedAt: string | null;
    completed: boolean;
}

// ============ ACHIEVEMENT ============
export type AchievementType =
    | 'first_task'
    | 'streak_7'
    | 'streak_30'
    | 'focus_master'
    | 'early_bird'
    | 'night_owl'
    | 'level_5'
    | 'level_10';

export interface Achievement {
    id: string;
    userId: string;
    achievementType: AchievementType;
    earnedAt: string;
}

// ============ SUBSCRIPTION ============
export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly' | 'lifetime';

export interface Subscription {
    id: string;
    userId: string;
    planType: PlanType;
    startedAt: string;
    expiresAt: string | null;
    isActive: boolean;
}

// ============ AI ============
export interface TimeBlock {
    startTime: string;
    endTime: string;
    type: 'focus' | 'break' | 'meeting' | 'light_work';
    taskId?: string;
    suggestion: string;
}

export interface DailyPlan {
    timeBlocks: TimeBlock[];
    aiInsights: string;
    energyCurve: number[];
}

// ============ ONBOARDING ============
export interface OnboardingAnswers {
    occupation?: string;
    chronotype?: 'morning' | 'evening' | 'intermediate';
    workHoursPerDay?: number;
    biggestChallenge?: string;
    wakeTime?: string;
    sleepTime?: string;
}
