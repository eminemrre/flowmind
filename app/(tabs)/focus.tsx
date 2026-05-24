import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withSpring,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';

import { config } from '@/constants/config';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { useTheme } from '@/components/ThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Theme } from '@/constants/theme';
import {
    saveTimerState,
    loadTimerState,
    clearTimerState,
    getRemainingSeconds,
    scheduleTimerEndNotification,
    cancelTimerNotification,
    registerBackgroundTimer,
} from '@/lib/backgroundTimer';

type TimerState = 'idle' | 'running' | 'paused' | 'break';

export default function FocusScreen() {
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [timeLeft, setTimeLeft] = useState(config.app.defaultPomodoroMinutes * 60);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    const { addXp } = useAuthStore();
    const { tasks } = useTaskStore();
    const activeTasks = tasks.filter(t => !t.isCompleted);

    const pulseAnim = useSharedValue(1);
    const appState = useRef(AppState.currentState);
    const timerNotifId = useRef<string | null>(null);

    // Register background task on mount
    useEffect(() => {
        registerBackgroundTimer();
    }, []);

    // AppState listener — save/restore timer on background/foreground
    useEffect(() => {
        const sub = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                // Going to background — save timer state
                if (timerState === 'running' && timeLeft > 0) {
                    await saveTimerState({
                        endTime: Date.now() + timeLeft * 1000,
                        isBreak,
                        sessionMinutes: config.app.defaultPomodoroMinutes,
                    });
                    // Schedule notification for timer end
                    const nId = await scheduleTimerEndNotification(timeLeft, isBreak);
                    timerNotifId.current = nId;
                }
            } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // Coming to foreground — restore timer
                const saved = await loadTimerState();
                if (saved) {
                    const remaining = getRemainingSeconds(saved);
                    if (remaining > 0) {
                        setTimeLeft(remaining);
                        setIsBreak(saved.isBreak);
                    } else {
                        // Timer completed while in background
                        handleTimerComplete();
                    }
                    await clearTimerState();
                }
                // Cancel scheduled notification
                if (timerNotifId.current) {
                    await cancelTimerNotification(timerNotifId.current);
                    timerNotifId.current = null;
                }
            }
            appState.current = nextAppState;
        });
        return () => sub.remove();
    }, [timerState, timeLeft, isBreak]);

    // Animation for timer
    useEffect(() => {
        if (timerState === 'running') {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1, // Infinite repeat
                true // Reverse
            );
        } else {
            cancelAnimation(pulseAnim);
            pulseAnim.value = withSpring(1);
        }
    }, [timerState]);

    // Timer countdown
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (timerState === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerState, timeLeft]);

    const handleTimerComplete = async () => {
        if (isBreak) {
            // Break finished, start new session
            setIsBreak(false);
            setTimeLeft(config.app.defaultPomodoroMinutes * 60);
            setTimerState('idle');
        } else {
            // Work session finished - save to backend
            const sessionMinutes = config.app.defaultPomodoroMinutes;
            setSessionsCompleted(prev => prev + 1);
            setTotalMinutes(prev => prev + sessionMinutes);

            // End session on backend
            if (currentSessionId) {
                try {
                    await apiClient.endFocusSession(currentSessionId, true);
                } catch { /* silent */ }
                setCurrentSessionId(null);
            }

            // Add XP locally (backend handles XP too)
            addXp(config.xp.focusSessionComplete);

            const isLongBreak = (sessionsCompleted + 1) % config.app.sessionsUntilLongBreak === 0;
            setIsBreak(true);
            setTimeLeft(isLongBreak ? config.app.longBreakMinutes * 60 : config.app.defaultBreakMinutes * 60);
            setTimerState('idle');

            Alert.alert('🎉 Tebrikler!', `Oturum tamamlandı! +${config.xp.focusSessionComplete} XP kazandın.`);
        }
    };

    const startTimer = async () => {
        setTimerState('running');

        // Start session on backend
        if (!isBreak) {
            try {
                const { data } = await apiClient.startFocusSession();
                if (data) {
                    setCurrentSessionId((data as any).id?.toString());
                }
            } catch { /* silent - timer still works locally */ }
        }
    };

    const pauseTimer = () => setTimerState('paused');
    const resumeTimer = () => setTimerState('running');

    const resetTimer = async () => {
        // End incomplete session on backend
        if (currentSessionId) {
            try {
                await apiClient.endFocusSession(currentSessionId, false);
            } catch { /* silent */ }
            setCurrentSessionId(null);
        }

        // Clear background state
        await clearTimerState();
        if (timerNotifId.current) {
            await cancelTimerNotification(timerNotifId.current);
            timerNotifId.current = null;
        }

        setTimerState('idle');
        setIsBreak(false);
        setTimeLeft(config.app.defaultPomodoroMinutes * 60);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = isBreak
        ? 1 - (timeLeft / (config.app.defaultBreakMinutes * 60))
        : 1 - (timeLeft / (config.app.defaultPomodoroMinutes * 60));

    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }]
    }));

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Session info */}
                <View style={styles.sessionInfo}>
                    <Text style={styles.sessionText}>
                        {isBreak ? '☕ Mola Zamanı' : '💻 Odaklanma Modu'}
                    </Text>
                    <Text style={styles.sessionCount}>
                        Oturum {sessionsCompleted + 1}/4
                    </Text>
                </View>

                {/* Timer Circle */}
                <Animated.View
                    style={[
                        styles.timerContainer,
                        animatedStyle
                    ]}
                >
                    <View style={[
                        styles.timerCircle,
                        isBreak && styles.timerCircleBreak,
                    ]}>
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                        <Text style={styles.timerLabel}>
                            {isBreak ? 'Dinlen' : 'Odaklan'}
                        </Text>
                    </View>

                    {/* Progress ring */}
                    <View style={[
                        styles.progressRing,
                        {
                            borderColor: isBreak ? theme.colors.success : theme.colors.primary,
                            opacity: progress,
                        }
                    ]} />
                </Animated.View>

                {/* Controls */}
                <View style={styles.controls}>
                    {timerState === 'idle' && (
                        <TouchableOpacity style={styles.playButton} onPress={startTimer}>
                            <Ionicons name="play" size={40} color="#fff" />
                        </TouchableOpacity>
                    )}

                    {timerState === 'running' && (
                        <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                            <Ionicons name="pause" size={40} color="#fff" />
                        </TouchableOpacity>
                    )}

                    {timerState === 'paused' && (
                        <View style={styles.pausedControls}>
                            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                                <Ionicons name="refresh" size={28} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.playButton} onPress={resumeTimer}>
                                <Ionicons name="play" size={40} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.placeholder} />
                        </View>
                    )}
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{sessionsCompleted}</Text>
                        <Text style={styles.statLabel}>Tamamlanan</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalMinutes}</Text>
                        <Text style={styles.statLabel}>Dakika</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>+{sessionsCompleted * config.xp.focusSessionComplete}</Text>
                        <Text style={styles.statLabel}>XP</Text>
                    </View>
                </View>

                {/* Current task indicator */}
                <View style={styles.currentTask}>
                    <Ionicons name="bookmark-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.currentTaskText}>
                        {activeTasks.length > 0
                            ? `📌 ${activeTasks[0].title}`
                            : 'Görev seçilmedi - Genel odaklanma'
                        }
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    sessionInfo: {
        alignItems: 'center',
        marginBottom: theme.spacing['3xl'],
    },
    sessionText: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    sessionCount: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    timerContainer: {
        position: 'relative',
        marginBottom: theme.spacing['3xl'],
    },
    timerCircle: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: theme.colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadow.lg,
    },
    timerCircleBreak: {
        backgroundColor: theme.colors.success + '15',
    },
    timerText: {
        fontSize: 56,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        fontSize: theme.fontSize.base,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    progressRing: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        borderWidth: 4,
        top: -10,
        left: -10,
    },
    controls: {
        marginBottom: theme.spacing['3xl'],
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadow.md,
    },
    pauseButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.warning,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadow.md,
    },
    pausedControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xl,
    },
    resetButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    placeholder: {
        width: 56,
    },
    stats: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        ...theme.shadow.sm,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    statValue: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
    },
    currentTask: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        gap: theme.spacing.sm,
    },
    currentTaskText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
});
