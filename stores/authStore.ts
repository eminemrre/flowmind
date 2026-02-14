import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, UserPreferences, Subscription } from '@/types';
import { apiClient } from '@/lib/api';

const TOKEN_KEY = 'flowmind_auth_token';
const USER_KEY = 'flowmind_user_data';

interface AuthState {
    // State
    user: User | null;
    preferences: UserPreferences | null;
    subscription: Subscription | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    hasCompletedOnboarding: boolean;

    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    setPreferences: (preferences: UserPreferences | null) => void;
    setSubscription: (subscription: Subscription | null) => void;
    setLoading: (loading: boolean) => void;
    setOnboardingComplete: (complete: boolean) => void;
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    preferences: null,
    subscription: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,

    // Login with real API
    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true });
            const { data, error } = await apiClient.login(email, password);

            if (error || !data) {
                set({ isLoading: false });
                return { success: false, error: error || 'Giriş başarısız' };
            }

            // Save token securely
            await SecureStore.setItemAsync(TOKEN_KEY, data.token);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

            // Set token on API client
            apiClient.setToken(data.token);

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                hasCompletedOnboarding: true,
            });

            return { success: true };
        } catch (err) {
            set({ isLoading: false });
            return { success: false, error: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
        }
    },

    // Register with real API
    register: async (email: string, password: string, name: string) => {
        try {
            set({ isLoading: true });
            const { data, error } = await apiClient.register(email, password, name);

            if (error || !data) {
                set({ isLoading: false });
                return { success: false, error: error || 'Kayıt başarısız' };
            }

            // Save token securely
            await SecureStore.setItemAsync(TOKEN_KEY, data.token);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

            // Set token on API client
            apiClient.setToken(data.token);

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                hasCompletedOnboarding: false, // New user goes to onboarding
            });

            return { success: true };
        } catch (err) {
            set({ isLoading: false });
            return { success: false, error: 'Bağlantı hatası. Lütfen tekrar deneyin.' };
        }
    },

    // Logout
    logout: async () => {
        try {
            await apiClient.logout();
        } catch {
            // Ignore logout API errors
        }
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        apiClient.setToken(null);

        set({
            user: null,
            preferences: null,
            subscription: null,
            isAuthenticated: false,
            hasCompletedOnboarding: false,
            isLoading: false,
        });
    },

    // Restore session on app start
    restoreSession: async () => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (!token) {
                set({ isLoading: false });
                return;
            }

            apiClient.setToken(token);

            // Verify token with backend
            const { data, error } = await apiClient.getMe();

            if (error || !data) {
                // Token expired or invalid
                await SecureStore.deleteItemAsync(TOKEN_KEY);
                await SecureStore.deleteItemAsync(USER_KEY);
                apiClient.setToken(null);
                set({ isLoading: false });
                return;
            }

            set({
                user: data,
                isAuthenticated: true,
                hasCompletedOnboarding: true,
                isLoading: false,
            });
        } catch {
            set({ isLoading: false });
        }
    },

    // Refresh user data (silent)
    checkAuth: async () => {
        try {
            const { data, error } = await apiClient.getMe();
            if (data && !error) {
                set({ user: data });
                // Also update stored user data
                await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data));
            }
        } catch {
            // Ignore errors for silent refresh
        }
    },

    // Simple setters
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

        const newXp = user.total_xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;

        set({
            user: {
                ...user,
                total_xp: newXp,
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
                current_streak: user.current_streak + 1,
            },
        });
    },

    resetStreak: () => {
        const { user } = get();
        if (!user) return;

        set({
            user: {
                ...user,
                current_streak: 0,
            },
        });
    },
}));

// Derived state helpers
export const useIsPro = () => {
    const subscription = useAuthStore((state) => state.subscription);
    return subscription?.isActive && subscription.planType !== 'free';
};
