import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { theme, lightTheme, darkTheme, Theme } from '@/constants/theme';
import { useSettingsStore } from '@/stores/settingsStore';

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const { themeMode, loadSettings } = useSettingsStore();
    const [activeTheme, setActiveTheme] = useState<Theme>(lightTheme);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        const isDark =
            themeMode === 'dark' ||
            (themeMode === 'system' && systemColorScheme === 'dark');

        setActiveTheme(isDark ? darkTheme : lightTheme);
    }, [themeMode, systemColorScheme]);

    return (
        <ThemeContext.Provider value={{
            theme: activeTheme,
            isDark: themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark')
        }}>
            {children}
        </ThemeContext.Provider>
    );
}
