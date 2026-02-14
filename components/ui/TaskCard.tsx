import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeIn,
    FadeOut,
    Layout
} from 'react-native-reanimated';
import { Theme } from '@/constants/theme';
import { Task, Priority, EnergyLevel } from '@/types';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useTheme } from '@/components/ThemeProvider';

interface TaskCardProps {
    task: Task;
    index?: number;
    onPress?: () => void;
    onComplete?: () => void;
    onDelete?: () => void;
    style?: ViewStyle;
}

const energyLabels: Record<EnergyLevel, string> = {
    low: '⚡ Low Energy',
    medium: '⚡⚡ Medium',
    high: '⚡⚡⚡ High Energy',
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function TaskCard({ task, index = 0, onPress, onComplete, onDelete, style }: TaskCardProps) {
    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);

    // Dynamic colors based on theme
    const priorityColors: Record<Priority, string> = {
        low: theme.colors.gray400,
        medium: theme.colors.info,
        high: theme.colors.warning,
        urgent: theme.colors.error,
    };

    const energyColors: Record<EnergyLevel, string> = {
        low: theme.colors.energy2,
        medium: theme.colors.energy3,
        high: theme.colors.energy5,
    };

    const swipeableRef = useRef<Swipeable>(null);
    const scale = useSharedValue(1);

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => {
                    swipeableRef.current?.close();
                    if (onDelete) onDelete();
                }}
            >
                <Ionicons name="trash-outline" size={24} color="#fff" />
                <Text style={styles.deleteText}>Sil</Text>
            </TouchableOpacity>
        );
    };

    const handlePressIn = () => {
        scale.value = withSpring(0.97);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleComplete = () => {
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <Animated.View
            entering={FadeIn.delay(index * 100)}
            exiting={FadeOut}
            layout={Layout.springify()}
            style={[styles.wrapper, style]}
        >
            <Swipeable
                ref={swipeableRef}
                renderRightActions={onDelete ? renderRightActions : undefined}
                overshootRight={false}
            >
                <AnimatedTouchableOpacity
                    style={[styles.container, animatedStyle]}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                >
                    <View style={styles.leftSection}>
                        <TouchableOpacity
                            style={[
                                styles.checkbox,
                                task.isCompleted && styles.checkboxCompleted,
                            ]}
                            onPress={handleComplete}
                        >
                            {task.isCompleted && (
                                <Animated.View entering={FadeIn}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </Animated.View>
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
                                <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                                <Text style={styles.metaText}>{task.estimatedMinutes}min</Text>
                            </View>

                            {task.scheduledTime && (
                                <View style={styles.metaItem}>
                                    <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
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
                </AnimatedTouchableOpacity>
            </Swipeable>
        </Animated.View>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    wrapper: {
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: theme.colors.card,
        ...theme.shadow.md,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: theme.spacing.base,
    },
    deleteAction: {
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
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
        overflow: 'hidden',
    },
    title: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: 2,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    description: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
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
        color: theme.colors.textSecondary,
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
