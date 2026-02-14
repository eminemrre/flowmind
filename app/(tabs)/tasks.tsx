import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { TaskCard } from '@/components/ui/TaskCard';
import { Confetti } from '@/components/ui/Confetti';
import { EmptyState } from '@/components/ui/EmptyState';
import TaskModal from '@/components/TaskModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { useTheme } from '@/components/ThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Theme } from '@/constants/theme';

export default function TasksScreen() {
    const {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        completeTask,
        clearError,
    } = useTaskStore();

    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [isModalVisible, setModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Show errors
    useEffect(() => {
        if (error) {
            Alert.alert('Hata', error);
            clearError();
        }
    }, [error]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchTasks();
        setRefreshing(false);
    }, [fetchTasks]);

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

    // Confetti State
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiCoords, setConfettiCoords] = useState({ x: 0, y: 0 });

    const handleToggleComplete = async (task: Task) => {
        if (!task.isCompleted) {
            // Trigger confetti
            setConfettiCoords({ x: 150, y: 100 }); // Approximate center or use touch coordinates if possible
            setShowConfetti(true);
            await completeTask(task.id);
        } else {
            // Uncomplete: update via PATCH
            await updateTask(task.id, { isCompleted: false });
        }
    };

    const handleSaveTask = async (taskData: Partial<Task>) => {
        if (modalMode === 'add') {
            await createTask(taskData);
        } else if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedTask) {
            await deleteTask(selectedTask.id);
            setSelectedTask(null);
        }
    };

    // ... (rest of the file)

    // ... (rest of the file) // This comment suggests we are keeping logic above, but replace_file_content needs context. 
    // I will replace the component return and styles definition.

    // I will replace the component return and styles definition.

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Görevler</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
                {(['all', 'active', 'completed'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterTab, filter === f && styles.filterTabActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f === 'all' ? 'Tümü' : f === 'active' ? 'Devam Eden' : 'Tamamlanan'}
                        </Text>
                        <View style={[styles.filterBadge, filter === f && styles.filterBadgeActive]}>
                            <Text style={[styles.filterBadgeText, filter === f && styles.filterBadgeTextActive]}>
                                {tasks.filter(t =>
                                    f === 'all' ? true : f === 'active' ? !t.isCompleted : t.isCompleted
                                ).length}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                {isLoading && !refreshing ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
                    </View>
                ) : tasks.length === 0 ? (
                    <EmptyState
                        title="Henüz görev yok"
                        subtitle="Yeni bir görev ekleyerek üretkenliğini artır!"
                        actionLabel="Yeni Görev Ekle"
                        onAction={handleAddTask}
                        icon="clipboard-outline"
                    />
                ) : (
                    <>
                        {/* Devam Edenler */}
                        {(filter === 'all' || filter === 'active') && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Devam Edenler</Text>
                                {tasks.filter(t => !t.isCompleted).map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        index={index}
                                        task={task}
                                        onPress={() => handleEditTask(task)}
                                        onComplete={() => handleToggleComplete(task)}
                                        onDelete={() => handleDeleteTask(task)}
                                    />
                                ))}
                                {tasks.filter(t => !t.isCompleted).length === 0 && (
                                    <EmptyState
                                        title="Harika!"
                                        subtitle="Tüm aktif görevlerini tamamladın."
                                        icon="checkmark-circle-outline"
                                        style={{ padding: 16 }}
                                    />
                                )}
                            </View>
                        )}

                        {/* Tamamlananlar */}
                        {(filter === 'all' || filter === 'completed') && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Tamamlananlar</Text>
                                {tasks.filter(t => t.isCompleted).map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        index={index}
                                        task={task}
                                        onPress={() => handleEditTask(task)}
                                        onComplete={() => handleToggleComplete(task)}
                                        onDelete={() => handleDeleteTask(task)}
                                    />
                                ))}
                                {tasks.filter(t => t.isCompleted).length === 0 && (
                                    <Text style={{ color: theme.colors.textSecondary, fontStyle: 'italic' }}>Tamamlanan görev yok.</Text>
                                )}
                            </View>
                        )}
                    </>
                )}
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

const createStyles = (theme: Theme) => StyleSheet.create({
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
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center' as const,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        gap: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterTabActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
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
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
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
    loadingState: {
        flex: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
    },
    emptyState: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
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
