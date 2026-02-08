import { Stack } from 'expo-router';
import { theme } from '@/constants/theme';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
            <Stack.Screen name="welcome" />
        </Stack>
    );
}
