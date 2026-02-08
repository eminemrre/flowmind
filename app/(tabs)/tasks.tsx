import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '@/components/ui/TaskCard';
import { Task } from '@/types';

const demoTasks: Task[] = [
    {
        id: '1', userId: 'demo', title: 'Proje X Kodlama', description: 'API integration',
        category: 'work', priority: 'high', energyLevel: 'high', estimatedMinutes: 120,
        dueDate: new Date().toISOString(), scheduledTime: null, isCompleted: false,
        completedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
        id: '2', userId: 'demo', title: 'E-postaları Cevapla', description: null,
        category: 'communication', priority: 'medium', energyLevel: 'low', estimatedMinutes: 30,
        dueDate: null, scheduledTime: null, isCompleted: false, completedAt: null,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
];

export default function TasksScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Button title="+ Yeni Görev" onPress={() => { }} size="sm" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Tüm Görevler</Text>
                    {demoTasks.map(task => (
                        <TaskCard key={task.id} task={task} onPress={() => { }} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.gray50 },
    scrollView: { flex: 1 },
    content: { padding: theme.spacing.base },
    header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: theme.spacing.xl },
    section: { marginBottom: theme.spacing.xl },
    sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray800, marginBottom: theme.spacing.md },
});
