import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/components/ThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Theme } from '@/constants/theme';

export default function Index() {
    const { isAuthenticated, hasCompletedOnboarding, isLoading, restoreSession } = useAuthStore();
    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);

    useEffect(() => {
        restoreSession();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    if (!hasCompletedOnboarding) {
        return <Redirect href="/(onboarding)/welcome" />;
    }

    return <Redirect href="/(tabs)/tasks" />;
}

const createStyles = (theme: Theme) => ({
    loading: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: theme.colors.background,
    },
});
