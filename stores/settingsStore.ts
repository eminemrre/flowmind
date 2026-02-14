import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
    themeMode: ThemeMode;
    notificationsEnabled: boolean;
    setThemeMode: (mode: ThemeMode) => void;
    toggleNotifications: () => void;
    loadSettings: () => Promise<void>;
}

const SETTINGS_KEY = 'flowmind_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
    themeMode: 'system',
    notificationsEnabled: true,

    setThemeMode: async (mode) => {
        set({ themeMode: mode });
        const settings = { themeMode: mode, notificationsEnabled: get().notificationsEnabled };
        await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
    },

    toggleNotifications: async () => {
        const newState = !get().notificationsEnabled;
        set({ notificationsEnabled: newState });
        const settings = { themeMode: get().themeMode, notificationsEnabled: newState };
        await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
    },

    loadSettings: async () => {
        try {
            const stored = await SecureStore.getItemAsync(SETTINGS_KEY);
            if (stored) {
                const settings = JSON.parse(stored);
                set({
                    themeMode: settings.themeMode || 'system',
                    notificationsEnabled: settings.notificationsEnabled ?? true
                });
            }
        } catch {
            // Fallback to defaults
        }
    }
}));
