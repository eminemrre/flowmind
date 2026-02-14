import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

function AppContent() {
    const { theme, isDark } = useTheme();

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
