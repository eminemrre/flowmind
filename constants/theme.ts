// FlowMind Theme — Cybermorphism (Dark + Indigo Neon + Glassmorphism)

export const palette = {
    // === Backgrounds (deep dark) ===
    bgDeep: '#050514',          // Modals, deepest layer
    bg: '#0A0A1F',              // Main background
    bgElevated: '#13132B',      // Cards on bg
    bgFloating: '#1B1B38',      // Modals, dropdowns

    // === Glass surfaces (use with BlurView) ===
    glass: 'rgba(255, 255, 255, 0.05)',
    glassStrong: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassBorderStrong: 'rgba(255, 255, 255, 0.2)',
    glassBorderNeon: 'rgba(139, 92, 246, 0.3)',

    // === Brand (indigo → violet → pink gradient) ===
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    violet: '#8B5CF6',
    pink: '#EC4899',

    // === Cyber accents ===
    cyan: '#06B6D4',
    teal: '#14B8A6',
    emerald: '#10B981',
    amber: '#F59E0B',
    red: '#EF4444',
    rose: '#F43F5E',

    // === Text (on dark) ===
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.70)',
    textMuted: 'rgba(255, 255, 255, 0.45)',
    textDim: 'rgba(255, 255, 255, 0.25)',
    textInverse: '#0A0A1F',

    // === Energy palette (cyan → indigo → pink) ===
    energy1: '#06B6D4',     // very low
    energy2: '#3B82F6',     // low
    energy3: '#6366F1',     // medium
    energy4: '#8B5CF6',     // high
    energy5: '#EC4899',     // peak

    // === Semantic ===
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',

    // === Legacy gray (backwards compat) ===
    gray50: '#13132B',
    gray100: '#1B1B38',
    gray200: '#2A2A4A',
    gray300: '#3A3A5C',
    gray400: 'rgba(255,255,255,0.45)',
    gray500: 'rgba(255,255,255,0.55)',
    gray600: 'rgba(255,255,255,0.70)',
    gray700: 'rgba(255,255,255,0.85)',
    gray800: '#13132B',
    gray900: '#0A0A1F',
    black: '#000000',
    white: '#FFFFFF',

    // === Dark specifics (backwards compat) ===
    darkBg: '#0A0A1F',
    darkSurface: '#13132B',
    darkBorder: 'rgba(255, 255, 255, 0.1)',
};

// === Gradients (use with LinearGradient component) ===
export const gradients = {
    brand: ['#6366F1', '#8B5CF6', '#EC4899'] as const,
    brandSoft: ['#6366F1', '#A855F7'] as const,
    cyber: ['#06B6D4', '#6366F1', '#EC4899'] as const,
    aurora: ['#6366F1', '#06B6D4', '#10B981'] as const,
    sunset: ['#EC4899', '#F43F5E', '#F59E0B'] as const,
    success: ['#10B981', '#06B6D4'] as const,
    danger: ['#EF4444', '#EC4899'] as const,
    energyLow: ['#06B6D4', '#3B82F6'] as const,
    energyMid: ['#6366F1', '#8B5CF6'] as const,
    energyHigh: ['#EC4899', '#F43F5E'] as const,
    background: ['#0A0A1F', '#13132B'] as const,
    glassCard: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const,
};

// === Glow shadows (cybermorphism signature) ===
export const glows = {
    indigo: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    pink: {
        shadowColor: '#EC4899',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    cyan: {
        shadowColor: '#06B6D4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    soft: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
};

export const theme = {
    colors: {
        ...palette,
        background: palette.bg,
        backgroundDark: palette.bgDeep,
        surface: palette.bgElevated,
        border: palette.glassBorder,
        text: palette.textPrimary,
        textSecondary: palette.textSecondary,
        textLight: palette.textPrimary,
        card: palette.bgElevated,
    },
    gradients,
    glows,
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
        '5xl': 48,
    },
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        black: '900' as const,
    },
    borderRadius: {
        sm: 6,
        md: 10,
        lg: 16,
        xl: 20,
        '2xl': 28,
        full: 9999,
    },
    shadow: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 6,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.5,
            shadowRadius: 24,
            elevation: 10,
        },
    },
} as const;

// Both themes use same dark cybermorphism palette
// (light theme kept as alias for backwards compat with ThemeProvider)
export const darkTheme = {
    ...theme,
    colors: {
        ...palette,
        background: palette.bg,
        surface: palette.bgElevated,
        surfaceHighlight: palette.bgFloating,
        text: palette.textPrimary,
        textSecondary: palette.textSecondary,
        textLight: palette.textPrimary,
        border: palette.glassBorder,
        card: palette.bgElevated,
    }
};

export const lightTheme = darkTheme; // Dark-only design — light alias prevents breakage

export type Theme = typeof darkTheme;
