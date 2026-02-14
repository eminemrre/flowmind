import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Theme } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';
import { useGamificationStore, ACHIEVEMENT_INFO } from '@/stores/gamificationStore';
import { apiClient } from '@/lib/api';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useTheme } from '@/components/ThemeProvider';

interface StatsData {
    tasksCompleted: number;
    focusMinutes: number;
    streak: number;
    xpEarned: number;
}

// Simple CountUp Component
const CountUp = ({ value, label, style }: { value: number, label?: string, style?: any }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const duration = 1000;
        const incrementTime = 50;
        const steps = duration / incrementTime;
        const increment = (end - start) / steps;

        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <Text style={style}>
            {displayValue}{label}
        </Text>
    );
};

export default function StatsScreen() {
    const { user } = useAuthStore();
    const { achievements, newAchievements, isLoading: achievementsLoading, fetchAchievements, checkAchievements, clearNewAchievements } = useGamificationStore();
    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

    const fetchStats = async () => {
        try {
            const { data } = await apiClient.getStats(period);
            if (data) {
                setStats(data as any);
            }
        } catch { /* sessiz */ }
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
        fetchAchievements();
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchStats();
    }, [period]);

    // Yeni başarım bildirimi
    useEffect(() => {
        if (newAchievements.length > 0) {
            const names = newAchievements.map((a: any) => `${a.emoji} ${a.title}`).join('\n');
            Alert.alert('🎉 Yeni Başarım!', names);
            clearNewAchievements();
        }
    }, [newAchievements]);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchStats(), fetchAchievements(), checkAchievements()]);
        setRefreshing(false);
    };

    const focusHours = stats ? Math.round((stats.focusMinutes || 0) / 60 * 10) / 10 : 0;
    const earnedCount = achievements.filter((a: any) => a.earned).length;
    const totalCount = achievements.length || Object.keys(ACHIEVEMENT_INFO).length;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
            >
                {/* Dönem Seçici */}
                <View style={styles.periodRow}>
                    {(['day', 'week', 'month'] as const).map(p => (
                        <TouchableOpacity
                            key={p}
                            style={[styles.periodTab, period === p && styles.periodTabActive]}
                            onPress={() => setPeriod(p)}
                        >
                            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                                {p === 'day' ? 'Bugün' : p === 'week' ? 'Hafta' : 'Ay'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <>
                        {/* Haftalık Özet */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                📈 {period === 'day' ? 'Bugün' : period === 'week' ? 'Bu Hafta' : 'Bu Ay'}
                            </Text>
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <CountUp value={stats?.tasksCompleted || 0} />
                                    <Text style={styles.statLabel}>Görev</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statNumber}>{focusHours}</Text>
                                    <Text style={styles.statLabel}>Saat</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <CountUp value={stats?.streak || 0} />
                                    <Text style={styles.statLabel}>🔥 Streak</Text>
                                </View>
                            </View>
                        </View>

                        {/* Seviye İlerlemesi */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>🎮 Seviye İlerlemesi</Text>
                            <View style={styles.levelContainer}>
                                <Text style={styles.levelText}>
                                    Level {user?.level || 1}
                                </Text>
                                <View style={styles.xpBar}>
                                    <View style={[styles.xpFill, { width: `${(user?.total_xp || 0) % 100}%` }]} />
                                </View>
                                <Text style={styles.xpText}>
                                    {(user?.total_xp || 0) % 100}/100 XP (Toplam: {user?.total_xp || 0})
                                </Text>
                            </View>
                        </View>

                        {/* Başarımlar */}
                        <View style={styles.card}>
                            <View style={styles.achievementHeader}>
                                <Text style={styles.cardTitle}>🏆 Başarımlar</Text>
                                <Text style={styles.achievementCount}>{earnedCount}/{totalCount}</Text>
                            </View>
                            <View style={styles.achievementGrid}>
                                {(achievements.length > 0 ? achievements : Object.entries(ACHIEVEMENT_INFO).map(([type, info]) => ({
                                    achievement_type: type,
                                    ...info,
                                    earned: false,
                                    earned_at: null,
                                }))).map((achievement: any) => (
                                    <TouchableOpacity
                                        key={achievement.achievement_type}
                                        style={[
                                            styles.achievementItem,
                                            !achievement.earned && styles.achievementLocked,
                                        ]}
                                        onPress={() => {
                                            const info = ACHIEVEMENT_INFO[achievement.achievement_type] || achievement;
                                            Alert.alert(
                                                `${info.emoji} ${info.title}`,
                                                `${info.description}${achievement.earned ? '\n\n✅ Kazanıldı!' : '\n\n🔒 Henüz kazanılmadı'}`
                                            );
                                        }}
                                    >
                                        <Text style={styles.achievementEmoji}>
                                            {achievement.earned
                                                ? (ACHIEVEMENT_INFO[achievement.achievement_type]?.emoji || achievement.emoji)
                                                : '🔒'
                                            }
                                        </Text>
                                        <Text style={[
                                            styles.achievementTitle,
                                            !achievement.earned && styles.achievementTitleLocked,
                                        ]}>
                                            {ACHIEVEMENT_INFO[achievement.achievement_type]?.title || achievement.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollView: { flex: 1 },
    content: { padding: theme.spacing.base, paddingBottom: theme.spacing['4xl'] },
    periodRow: { flexDirection: 'row', marginBottom: theme.spacing.base, gap: theme.spacing.sm },
    periodTab: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    periodTabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    periodText: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.textSecondary },
    periodTextActive: { color: '#fff', fontWeight: theme.fontWeight.bold },
    loadingState: { paddingVertical: 60, alignItems: 'center' },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.base,
        ...theme.shadow.sm,
    },
    cardTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: theme.spacing.md },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: theme.fontSize['3xl'], fontWeight: theme.fontWeight.bold, color: theme.colors.primary },
    statLabel: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary },
    levelContainer: { alignItems: 'center' },
    levelText: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text, marginBottom: theme.spacing.sm },
    xpBar: { width: '100%', height: 12, backgroundColor: theme.colors.gray100, borderRadius: theme.borderRadius.full, overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.full },
    xpText: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
    achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    achievementCount: { fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.bold },
    achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    achievementItem: {
        width: '23%',
        alignItems: 'center',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primary + '15',
    },
    achievementLocked: { backgroundColor: theme.colors.gray100, opacity: 0.6 },
    achievementEmoji: { fontSize: 28, marginBottom: 4 },
    achievementTitle: { fontSize: 10, color: theme.colors.text, textAlign: 'center', fontWeight: theme.fontWeight.medium },
    achievementTitleLocked: { color: theme.colors.textSecondary },
});
