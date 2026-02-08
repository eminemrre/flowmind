import { create } from 'zustand';
import { User, UserPreferences, Subscription } from '@/types';

interface AuthState {
    // State
    user: User | null;
    preferences: UserPreferences | null;
    subscription: Subscription | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    hasCompletedOnboarding: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setPreferences: (preferences: UserPreferences | null) => void;
    setSubscription: (subscription: Subscription | null) => void;
    setLoading: (loading: boolean) => void;
    setOnboardingComplete: (complete: boolean) => void;
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    preferences: null,
    subscription: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,

    // Actions
    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
    }),

    setPreferences: (preferences) => set({ preferences }),

    setSubscription: (subscription) => set({ subscription }),

    setLoading: (isLoading) => set({ isLoading }),

    setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

    addXp: (amount) => {
        const { user } = get();
        if (!user) return;

        const newXp = user.totalXp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;

        set({
            user: {
                ...user,
                totalXp: newXp,
                level: newLevel,
            },
        });
    },

    incrementStreak: () => {
        const { user } = get();
        if (!user) return;

        set({
            user: {
                ...user,
                currentStreak: user.currentStreak + 1,
            },
        });
    },

    resetStreak: () => {
        const { user } = get();
        if (!user) return;

        set({
            user: {
                ...user,
                currentStreak: 0,
            },
        });
    },

    logout: () => set({
        user: null,
        preferences: null,
        subscription: null,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
    }),
}));

// Derived state helpers
export const useIsPro = () => {
    const subscription = useAuthStore((state) => state.subscription);
    return subscription?.isActive && subscription.planType !== 'free';
};
