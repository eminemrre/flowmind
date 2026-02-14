import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { scheduleDailyMotivation, registerForPushNotificationsAsync } from '@/lib/notifications';
import { onNetworkRestore, syncPendingActions } from '@/lib/offlineStore';

function AppContent() {
    const { theme, isDark } = useTheme();

    // Schedule daily notification + register push + auto-sync offline
    useEffect(() => {
        registerForPushNotificationsAsync().catch(() => { });
        scheduleDailyMotivation().catch(() => { });

        // When network comes back, sync pending offline actions
        const unsub = onNetworkRestore(() => {
            syncPendingActions().catch(() => { });
        });
        return unsub;
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="(onboarding)"
                    options={{ headerShown: false }}
                />
            </Stack>
        </View>
    );
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
