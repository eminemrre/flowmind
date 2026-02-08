import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { TaskCard } from '@/components/ui/TaskCard';
import TaskModal from '@/components/TaskModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { Task } from '@/types';

// Demo data - later will be replaced with API calls
const initialTasks: Task[] = [
    {
        id: '1',
        userId: 'demo',
        title: 'Proje X Kodlama',
        description: 'API integration tamamla',
        category: 'work',
        priority: 'high',
        energyLevel: 'high',
        estimatedMinutes: 120,
        dueDate: new Date().toISOString(),
        scheduledTime: null,
        isCompleted: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        userId: 'demo',
        title: 'E-postaları Cevapla',
        description: 'Müşteri maillerini yanıtla',
        category: 'personal',
        priority: 'medium',
        energyLevel: 'low',
        estimatedMinutes: 30,
        dueDate: null,
        scheduledTime: null,
        isCompleted: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        userId: 'demo',
        title: 'Egzersiz Yap',
        description: '30 dakika koşu',
        category: 'health',
        priority: 'low',
        energyLevel: 'medium',
        estimatedMinutes: 45,
        dueDate: null,
        scheduledTime: null,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate API refresh
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handleAddTask = () => {
        setSelectedTask(null);
        setModalMode('add');
        setModalVisible(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setModalMode('edit');
        setModalVisible(true);
    };

    const handleDeleteTask = (task: Task) => {
        setSelectedTask(task);
        setDeleteModalVisible(true);
    };

    const handleToggleComplete = (task: Task) => {
        setTasks(prev =>
            prev.map(t =>
                t.id === task.id
                    ? {
                        ...t,
                        isCompleted: !t.isCompleted,
                        completedAt: !t.isCompleted ? new Date().toISOString() : null,
                    }
                    : t
            )
        );
    };

    const handleSaveTask = (taskData: Partial<Task>) => {
        if (modalMode === 'add') {
            const newTask: Task = {
                id: Date.now().toString(),
                userId: 'demo',
                title: taskData.title || '',
                description: taskData.description || null,
                category: taskData.category || 'other',
                priority: taskData.priority || 'medium',
                energyLevel: taskData.energyLevel || 'medium',
                estimatedMinutes: taskData.estimatedMinutes || 25,
                dueDate: null,
                scheduledTime: null,
                isCompleted: false,
                completedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setTasks(prev => [newTask, ...prev]);
        } else {
            setTasks(prev =>
                prev.map(t =>
                    t.id === selectedTask?.id
                        ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
                        : t
                )
            );
        }
    };

    const handleConfirmDelete = () => {
        if (selectedTask) {
            setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
            setSelectedTask(null);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.isCompleted;
        if (filter === 'completed') return task.isCompleted;
        return true;
    });

    const activeTasks = filteredTasks.filter(t => !t.isCompleted);
    const completedTasks = filteredTasks.filter(t => t.isCompleted);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📋 Görevler</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {(['all', 'active', 'completed'] as const).map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterTab, filter === f && styles.filterTabActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Tamamlanan'}
                        </Text>
                        <View style={[styles.filterBadge, filter === f && styles.filterBadgeActive]}>
                            <Text style={[styles.filterBadgeText, filter === f && styles.filterBadgeTextActive]}>
                                {f === 'all' ? tasks.length : f === 'active' ? tasks.filter(t => !t.isCompleted).length : tasks.filter(t => t.isCompleted).length}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Active Tasks */}
                {activeTasks.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Yapılacak</Text>
                        {activeTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onPress={() => handleEditTask(task)}
                                onComplete={() => handleToggleComplete(task)}
                                onDelete={() => handleDeleteTask(task)}
                            />
                        ))}
                    </View>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>✅ Tamamlanan</Text>
                        {completedTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onPress={() => handleEditTask(task)}
                                onComplete={() => handleToggleComplete(task)}
                                onDelete={() => handleDeleteTask(task)}
                            />
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {filteredTasks.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={64} color={theme.colors.textSecondary} />
                        <Text style={styles.emptyTitle}>
                            {filter === 'completed' ? 'Henüz tamamlanan görev yok' : 'Görev bulunamadı'}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {filter === 'all' ? 'Yeni görev eklemek için + butonuna tıkla' : ''}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Task Modal */}
            <TaskModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveTask}
                task={selectedTask}
                mode={modalMode}
            />

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                visible={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={handleConfirmDelete}
                taskTitle={selectedTask?.title || ''}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        gap: theme.spacing.xs,
    },
    filterTabActive: {
        backgroundColor: theme.colors.primary,
    },
    filterText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    filterBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    filterBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    filterBadgeText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    filterBadgeTextActive: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.md,
        paddingBottom: 100,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginTop: theme.spacing.md,
    },
    emptySubtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
});
