import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
    const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

    // Redirect based on auth state
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    if (!hasCompletedOnboarding) {
        return <Redirect href="/(onboarding)/welcome" />;
    }

    return <Redirect href="/(tabs)" />;
}
