import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeProvider';

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.gray400,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 80,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.text,
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 24,
                    color: theme.colors.text,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Bugün',
                    headerTitle: '🌅 Bugün',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="today-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Görevler',
                    headerTitle: '📋 Görevler',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="focus"
                options={{
                    title: 'Odaklan',
                    headerTitle: '🎯 Odaklan',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="timer-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'İstatistik',
                    headerTitle: '📊 İstatistikler',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Takvim',
                    headerTitle: '📅 Takvim',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile" // Added profile screen correctly to the tabs
                options={{
                    title: 'Profil',
                    headerTitle: '👤 Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
