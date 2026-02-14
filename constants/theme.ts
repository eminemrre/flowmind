// FlowMind Theme Constants
export const palette = {
    // Primary
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Neutral
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
    white: '#FFFFFF',

    // Energy
    energy1: '#EF4444',
    energy2: '#F97316',
    energy3: '#EAB308',
    energy4: '#84CC16',
    energy5: '#22C55E',

    // Dark specifics
    darkBg: '#0F172A',
    darkSurface: '#1E293B',
    darkBorder: '#334155',
};

export const theme = {
    colors: {
        ...palette,
        background: palette.white,
        backgroundDark: palette.darkBg,
        surface: palette.gray50,
        border: palette.gray200,
        text: palette.gray900,
        textSecondary: palette.gray500,
        textLight: palette.gray50,
        card: palette.white,
    },
    // ... spacing, fontSize etc remain same
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        base: 16,
        lg: 20,
        xl: 24,
        '2xl': 32,
        '3xl': 40,
        '4xl': 48,
    },
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    shadow: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
            elevation: 5,
        },
    },
} as const;

export const lightTheme = {
    ...theme,
    colors: {
        ...palette,
        background: '#FFFFFF',
        surface: '#FFFFFF',
        surfaceHighlight: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280',
        textLight: palette.gray50,
        border: '#E5E7EB',
        card: '#FFFFFF',
    }
};

export const darkTheme = {
    ...theme,
    colors: {
        ...palette,
        background: '#0F172A',
        surface: '#1E293B',
        surfaceHighlight: '#334155',
        text: '#F9FAFB',
        textSecondary: '#9CA3AF',
        textLight: palette.gray50,
        border: '#334155',
        card: '#1E293B',
        gray50: '#1E293B',
        gray100: '#334155',
        gray200: '#475569',
    }
};

export type Theme = typeof lightTheme;

