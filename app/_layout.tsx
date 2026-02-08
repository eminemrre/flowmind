import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export default function RootLayout() {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
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
                        backgroundColor: theme.colors.gray50,
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});
