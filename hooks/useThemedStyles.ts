import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Theme } from '@/constants/theme';

export function useThemedStyles<T>(
    styleFactory: (theme: Theme) => T
): T {
    const { theme } = useTheme();
    return useMemo(() => styleFactory(theme), [theme]);
}
