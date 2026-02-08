import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Task, Priority, EnergyLevel } from '@/types';

interface TaskCardProps {
    task: Task;
    onPress?: () => void;
    onComplete?: () => void;
    style?: ViewStyle;
}

const priorityColors: Record<Priority, string> = {
    low: theme.colors.gray400,
    medium: theme.colors.info,
    high: theme.colors.warning,
    urgent: theme.colors.error,
};

const energyLabels: Record<EnergyLevel, string> = {
    low: '⚡ Low Energy',
    medium: '⚡⚡ Medium',
    high: '⚡⚡⚡ High Energy',
};

const energyColors: Record<EnergyLevel, string> = {
    low: theme.colors.energy2,
    medium: theme.colors.energy3,
    high: theme.colors.energy5,
};

export function TaskCard({ task, onPress, onComplete, style }: TaskCardProps) {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <TouchableOpacity
                    style={[
                        styles.checkbox,
                        task.isCompleted && styles.checkboxCompleted,
                    ]}
                    onPress={onComplete}
                >
                    {task.isCompleted && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.energyBadge,
                            { backgroundColor: energyColors[task.energyLevel] + '20', color: energyColors[task.energyLevel] }
                        ]}
                    >
                        {energyLabels[task.energyLevel]}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.title,
                        task.isCompleted && styles.titleCompleted,
                    ]}
                    numberOfLines={2}
                >
                    {task.title}
                </Text>

                {task.description && (
                    <Text style={styles.description} numberOfLines={1}>
                        {task.description}
                    </Text>
                )}

                <View style={styles.footer}>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={theme.colors.gray400} />
                        <Text style={styles.metaText}>{task.estimatedMinutes}min</Text>
                    </View>

                    {task.scheduledTime && (
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={14} color={theme.colors.gray400} />
                            <Text style={styles.metaText}>
                                {new Date(task.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}

                    <View
                        style={[
                            styles.priorityBadge,
                            { backgroundColor: priorityColors[task.priority] + '20' }
                        ]}
                    >
                        <View
                            style={[
                                styles.priorityDot,
                                { backgroundColor: priorityColors[task.priority] }
                            ]}
                        />
                        <Text style={[styles.priorityText, { color: priorityColors[task.priority] }]}>
                            {task.priority}
                        </Text>
                    </View>
                </View>
            </View>

            <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.gray300}
                style={styles.chevron}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.md,
        ...theme.shadow.md,
    },
    leftSection: {
        marginRight: theme.spacing.md,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: theme.borderRadius.full,
        borderWidth: 2,
        borderColor: theme.colors.gray300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xs,
    },
    energyBadge: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    title: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.gray900,
        marginBottom: theme.spacing.xs,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: theme.colors.gray400,
    },
    description: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.gray500,
        marginBottom: theme.spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.gray500,
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
        gap: 4,
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    priorityText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        textTransform: 'capitalize',
    },
    chevron: {
        marginLeft: theme.spacing.sm,
    },
});
