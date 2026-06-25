import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { palette, theme } from '@/constants/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: palette.primaryLight,
                tabBarInactiveTintColor: palette.textMuted,
                tabBarStyle: {
                    backgroundColor: 'rgba(10, 10, 31, 0.92)',
                    borderTopColor: palette.glassBorder,
                    borderTopWidth: 1,
                    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
                    paddingTop: 8,
                    height: Platform.OS === 'ios' ? 88 : 72,
                    position: 'absolute',
                    elevation: 0,
                    shadowColor: palette.primary,
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.3,
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
                headerStyle: {
                    backgroundColor: palette.bg,
                    borderBottomWidth: 0,
                },
                headerTintColor: palette.textPrimary,
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 22,
                    color: palette.textPrimary,
                    letterSpacing: -0.3,
                },
                sceneStyle: { backgroundColor: palette.bg },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Bugün',
                    headerTitle: 'Bugün',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'sunny' : 'sunny-outline'}
                            size={focused ? 26 : 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'Görevler',
                    headerTitle: 'Görevler',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'checkbox' : 'checkbox-outline'}
                            size={focused ? 26 : 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="focus"
                options={{
                    title: 'Odaklan',
                    headerTitle: 'Odaklan',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'flame' : 'flame-outline'}
                            size={focused ? 26 : 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'İstatistik',
                    headerTitle: 'İstatistikler',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'stats-chart' : 'stats-chart-outline'}
                            size={focused ? 26 : 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Takvim',
                    headerTitle: 'Takvim',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={focused ? 26 : 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    headerTitle: 'Profil',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person-circle' : 'person-circle-outline'}
                            size={focused ? 28 : 26}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
