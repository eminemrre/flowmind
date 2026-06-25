import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, palette } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { GradientButton } from '@/components/ui/GradientButton';
import { TaskCard } from '@/components/ui/TaskCard';
import { EnergyBar } from '@/components/ui/EnergyBar';
import { Confetti } from '@/components/ui/Confetti';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import { aiService } from '@/lib/ai';

export default function TodayScreen() {
    const { user } = useAuthStore();
    const { tasks, todaysTasks, isLoading, fetchTasks, completeTask } = useTaskStore();

    const [aiInsight, setAiInsight] = useState<string>('');
    const [aiLoading, setAiLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Confetti State
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiCoords, setConfettiCoords] = useState({ x: 0, y: 0 });

    const handleTaskComplete = async (taskId: string) => {
        // Trigger confetti
        setConfettiCoords({ x: 150, y: 100 });
        setShowConfetti(true);
        await completeTask(taskId);
    };

    // Use today's tasks if available, otherwise show all pending tasks (max 5)
    const displayTasks = todaysTasks.length > 0 ? todaysTasks : tasks.filter(t => !t.isCompleted).slice(0, 5);
    const pendingTasks = displayTasks.filter(t => !t.isCompleted);
    const completedTasks = displayTasks.filter(t => t.isCompleted);

    const greeting = getGreeting();
    const userName = user?.name || 'Kullanıcı';

    // Fetch tasks and AI insight on mount
    useEffect(() => {
        fetchTasks();
        loadAiInsight();
    }, []);

    const loadAiInsight = async () => {
        setAiLoading(true);
        try {
            const currentHour = new Date().getHours();
            const insight = await aiService.getDailyInsight(
                pendingTasks,
                3, // default energy level
                currentHour
            );
            setAiInsight(insight);
        } catch {
            setAiInsight('Bugünkü görevlerini kontrol et ve en önemli olandan başla.');
        }
        setAiLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTasks();
        await loadAiInsight();
        setRefreshing(false);
    };

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={[palette.bgDeep, palette.bg, palette.bgElevated]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <GlowOrb color="indigo" size={420} opacity={0.28} style={{ top: -140, left: -110 }} />
            <GlowOrb color="pink" size={320} opacity={0.18} style={{ top: '35%', right: -120 }} />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.primaryLight} />
                    }
                >
                    {/* Greeting */}
                    <View style={styles.greetingSection}>
                        <Text style={styles.greeting}>{greeting}</Text>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.subtitle}>
                            Bugün için {pendingTasks.length} görev planlandı
                        </Text>
                    </View>

                    {/* Energy Bar */}
                    <View style={styles.section}>
                        <EnergyBar level={4} />
                    </View>

                    {/* AI Insight Card */}
                    <GlassCard glow="indigo" padding="lg" style={styles.aiCard}>
                        <Text style={styles.aiLabel}>AI ÖNERİSİ</Text>
                        {aiLoading ? (
                            <ActivityIndicator size="small" color={palette.primaryLight} style={{ marginVertical: 12, alignSelf: 'flex-start' }} />
                        ) : (
                            <Text style={styles.aiText}>
                                {aiInsight || 'Bugünkü görevlerini kontrol et ve en önemli olandan başla.'}
                            </Text>
                        )}
                        <GradientButton
                            title="Yenile"
                            onPress={loadAiInsight}
                            variant="glass"
                            size="sm"
                            glow={false}
                            style={styles.aiButton}
                        />
                    </GlassCard>

                    {/* Loading State */}
                    {isLoading && tasks.length === 0 ? (
                        <View style={styles.loadingState}>
                            <ActivityIndicator size="large" color={palette.primaryLight} />
                        </View>
                    ) : (
                        <>
                            {/* Pending Tasks */}
                            {pendingTasks.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionLabel}>YAPILACAKLAR</Text>
                                    {pendingTasks.map((task, index) => (
                                        <TaskCard
                                            key={task.id}
                                            index={index}
                                            task={task}
                                            onComplete={() => handleTaskComplete(task.id)}
                                            onPress={() => router.push('/(tabs)/tasks')}
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Completed Tasks */}
                            {completedTasks.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionLabel}>TAMAMLANANLAR</Text>
                                    {completedTasks.map((task, index) => (
                                        <TaskCard
                                            key={task.id}
                                            index={index}
                                            task={task}
                                            onPress={() => router.push('/(tabs)/tasks')}
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Empty State */}
                            {displayTasks.length === 0 && !isLoading && (
                                <GlassCard padding="2xl" style={styles.emptyState}>
                                    <Text style={styles.emptyTitle}>Bugün temiz</Text>
                                    <Text style={styles.emptySubtitle}>Yeni bir görev ekleyerek başla</Text>
                                </GlassCard>
                            )}
                        </>
                    )}

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <GradientButton
                            title="Yeni Görev"
                            onPress={() => router.push('/(tabs)/tasks')}
                            variant="glass"
                            glow={false}
                            fullWidth
                        />
                        <View style={styles.actionGap} />
                        <GradientButton
                            title="Odaklanmaya Başla"
                            onPress={() => router.push('/(tabs)/focus')}
                            variant="brand"
                            size="lg"
                            fullWidth
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Confetti Overlay */}
            {showConfetti && (
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    <Confetti
                        x={confettiCoords.x}
                        y={confettiCoords.y}
                        count={50}
                        onAnimationComplete={() => setShowConfetti(false)}
                    />
                </View>
            )}
        </View>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın,';
    if (hour < 18) return 'İyi günler,';
    return 'İyi akşamlar,';
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: palette.bg,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing['4xl'],
    },
    greetingSection: {
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.sm,
    },
    greeting: {
        fontSize: theme.fontSize.lg,
        color: palette.textSecondary,
        letterSpacing: 0.3,
    },
    userName: {
        fontSize: theme.fontSize['4xl'],
        fontWeight: theme.fontWeight.bold,
        color: palette.textPrimary,
        letterSpacing: -0.5,
        marginVertical: 2,
    },
    subtitle: {
        fontSize: theme.fontSize.base,
        color: palette.textMuted,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionLabel: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
        color: palette.textMuted,
        letterSpacing: 1.6,
        marginBottom: theme.spacing.md,
    },
    aiCard: {
        marginBottom: theme.spacing.xl,
    },
    aiLabel: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
        color: palette.primaryLight,
        letterSpacing: 1.8,
        marginBottom: theme.spacing.sm,
    },
    aiText: {
        fontSize: theme.fontSize.base,
        color: palette.textSecondary,
        lineHeight: 22,
        marginBottom: theme.spacing.base,
    },
    aiButton: {
        alignSelf: 'flex-start',
    },
    loadingState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    emptyTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: palette.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    emptySubtitle: {
        fontSize: theme.fontSize.sm,
        color: palette.textMuted,
    },
    quickActions: {
        marginTop: theme.spacing.md,
    },
    actionGap: {
        height: theme.spacing.md,
    },
});
