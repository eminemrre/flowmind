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
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
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
            setAiInsight('Bugünkü görevlerini kontrol et ve en önemli olandan başla! 💪');
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
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Greeting */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>{greeting}</Text>
                    <Text style={styles.userName}>{userName}! 👋</Text>
                    <Text style={styles.subtitle}>
                        Bugün için {pendingTasks.length} görev planlandı
                    </Text>
                </View>

                {/* Energy Bar */}
                <View style={styles.section}>
                    <EnergyBar level={4} />
                </View>

                {/* AI Insight Card */}
                <View style={styles.aiCard}>
                    <View style={styles.aiHeader}>
                        <Text style={styles.aiEmoji}>🧠</Text>
                        <Text style={styles.aiTitle}>AI Önerisi</Text>
                    </View>
                    {aiLoading ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 12 }} />
                    ) : (
                        <Text style={styles.aiText}>
                            {aiInsight || 'Bugünkü görevlerini kontrol et ve en önemli olandan başla! 💪'}
                        </Text>
                    )}
                    <Button
                        title="Yenile"
                        onPress={loadAiInsight}
                        size="sm"
                        style={styles.aiButton}
                    />
                </View>

                {/* Loading State */}
                {isLoading && tasks.length === 0 ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <>
                        {/* Pending Tasks */}
                        {pendingTasks.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📋 Yapılacaklar</Text>
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
                                <Text style={styles.sectionTitle}>✅ Tamamlananlar</Text>
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
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🎉</Text>
                                <Text style={styles.emptyTitle}>Görev yok!</Text>
                                <Text style={styles.emptySubtitle}>Yeni görev ekleyerek başla</Text>
                            </View>
                        )}
                    </>
                )}

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Button
                        title="+ Yeni Görev"
                        onPress={() => router.push('/(tabs)/tasks')}
                        variant="outline"
                        fullWidth
                    />
                    <View style={styles.actionGap} />
                    <Button
                        title="🎯 Odaklanmaya Başla"
                        onPress={() => router.push('/(tabs)/focus')}
                        variant="primary"
                        fullWidth
                    />
                </View>
            </ScrollView>

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
        </SafeAreaView>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın,';
    if (hour < 18) return 'İyi günler,';
    return 'İyi akşamlar,';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.gray50,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.base,
        paddingBottom: theme.spacing['4xl'],
    },
    greetingSection: {
        marginBottom: theme.spacing.xl,
    },
    greeting: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.gray500,
    },
    userName: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.gray900,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.fontSize.base,
        color: theme.colors.gray500,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.gray800,
        marginBottom: theme.spacing.md,
    },
    aiCard: {
        backgroundColor: theme.colors.primary + '10',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.primary + '30',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    aiEmoji: {
        fontSize: 20,
        marginRight: theme.spacing.sm,
    },
    aiTitle: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    aiText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.gray700,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
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
        paddingVertical: 40,
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.gray800,
        marginTop: theme.spacing.md,
    },
    emptySubtitle: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.gray500,
    },
    quickActions: {
        marginTop: theme.spacing.xl,
    },
    actionGap: {
        height: theme.spacing.md,
    },
});
