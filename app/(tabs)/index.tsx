import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '@/components/ui/TaskCard';
import { EnergyBar } from '@/components/ui/EnergyBar';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import { Task } from '@/types';

// Demo data for initial testing
const demoTasks: Task[] = [
    {
        id: '1',
        userId: 'demo',
        title: 'Proje X Kodlama',
        description: 'API integration ve backend bağlantısı',
        category: 'work',
        priority: 'high',
        energyLevel: 'high',
        estimatedMinutes: 120,
        dueDate: new Date().toISOString(),
        scheduledTime: new Date(new Date().setHours(9, 0)).toISOString(),
        isCompleted: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        userId: 'demo',
        title: 'E-postaları Cevapla',
        description: 'Müşteri e-postalarını kontrol et',
        category: 'communication',
        priority: 'medium',
        energyLevel: 'low',
        estimatedMinutes: 30,
        dueDate: new Date().toISOString(),
        scheduledTime: new Date(new Date().setHours(11, 30)).toISOString(),
        isCompleted: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        userId: 'demo',
        title: 'Toplantı Notları',
        description: 'Dünkü toplantının notlarını düzenle',
        category: 'work',
        priority: 'low',
        energyLevel: 'medium',
        estimatedMinutes: 45,
        dueDate: new Date().toISOString(),
        scheduledTime: new Date(new Date().setHours(14, 0)).toISOString(),
        isCompleted: true,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default function TodayScreen() {
    const { user } = useAuthStore();
    const { todaysTasks, completeTask } = useTaskStore();

    // Use demo data if no tasks
    const tasks = todaysTasks.length > 0 ? todaysTasks : demoTasks;
    const pendingTasks = tasks.filter(t => !t.isCompleted);
    const completedTasks = tasks.filter(t => t.isCompleted);

    const greeting = getGreeting();
    const userName = user?.name || 'Kullanıcı';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
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
                    <Text style={styles.aiText}>
                        Şu an enerji seviyeniz yüksek! En zorlu görev olan "Proje X Kodlama"
                        için harika bir zaman. Öğleden sonra enerji düşebilir, hafif işleri
                        o zamana bırakabilirsin.
                    </Text>
                    <Button
                        title="Planı Kabul Et"
                        onPress={() => { }}
                        size="sm"
                        style={styles.aiButton}
                    />
                </View>

                {/* Pending Tasks */}
                {pendingTasks.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Yapılacaklar</Text>
                        {pendingTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onComplete={() => completeTask(task.id)}
                                onPress={() => { }}
                            />
                        ))}
                    </View>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✅ Tamamlananlar</Text>
                        {completedTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onPress={() => { }}
                            />
                        ))}
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Button
                        title="+ Yeni Görev"
                        onPress={() => { }}
                        variant="outline"
                        fullWidth
                    />
                    <View style={styles.actionGap} />
                    <Button
                        title="🎯 Odaklanmaya Başla"
                        onPress={() => { }}
                        variant="primary"
                        fullWidth
                    />
                </View>
            </ScrollView>
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
    quickActions: {
        marginTop: theme.spacing.xl,
    },
    actionGap: {
        height: theme.spacing.md,
    },
});
