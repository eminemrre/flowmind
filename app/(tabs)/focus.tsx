import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Pressable,
    Alert,
    AppState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withSpring,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';

import { config } from '@/constants/config';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { palette, theme } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowOrb } from '@/components/ui/GlowOrb';
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
    const activeTasks = tasks.filter((t) => !t.isCompleted);

    const pulseAnim = useSharedValue(1);
    const orbAnim = useSharedValue(0.6);
    const appState = useRef(AppState.currentState);
    const timerNotifId = useRef<string | null>(null);

    useEffect(() => {
        registerBackgroundTimer();
    }, []);

    useEffect(() => {
        const sub = AppState.addEventListener('change', async (nextAppState) => {
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                if (timerState === 'running' && timeLeft > 0) {
                    await saveTimerState({
                        endTime: Date.now() + timeLeft * 1000,
                        isBreak,
                        sessionMinutes: config.app.defaultPomodoroMinutes,
                    });
                    const nId = await scheduleTimerEndNotification(timeLeft, isBreak);
                    timerNotifId.current = nId;
                }
            } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                const saved = await loadTimerState();
                if (saved) {
                    const remaining = getRemainingSeconds(saved);
                    if (remaining > 0) {
                        setTimeLeft(remaining);
                        setIsBreak(saved.isBreak);
                    } else {
                        handleTimerComplete();
                    }
                    await clearTimerState();
                }
                if (timerNotifId.current) {
                    await cancelTimerNotification(timerNotifId.current);
                    timerNotifId.current = null;
                }
            }
            appState.current = nextAppState;
        });
        return () => sub.remove();
    }, [timerState, timeLeft, isBreak]);

    // Breathing pulse + orb shimmer
    useEffect(() => {
        if (timerState === 'running') {
            pulseAnim.value = withRepeat(
                withSequence(
                    withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            orbAnim.value = withRepeat(
                withSequence(
                    withTiming(0.85, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.5, { duration: 2200, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        } else {
            cancelAnimation(pulseAnim);
            cancelAnimation(orbAnim);
            pulseAnim.value = withSpring(1);
            orbAnim.value = withTiming(0.4, { duration: 600 });
        }
    }, [timerState]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (timerState === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
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
            setIsBreak(false);
            setTimeLeft(config.app.defaultPomodoroMinutes * 60);
            setTimerState('idle');
        } else {
            const sessionMinutes = config.app.defaultPomodoroMinutes;
            setSessionsCompleted((prev) => prev + 1);
            setTotalMinutes((prev) => prev + sessionMinutes);

            if (currentSessionId) {
                try {
                    await apiClient.endFocusSession(currentSessionId, true);
                } catch { /* silent */ }
                setCurrentSessionId(null);
            }

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
        if (!isBreak) {
            try {
                const { data } = await apiClient.startFocusSession();
                if (data) {
                    setCurrentSessionId((data as any).id?.toString());
                }
            } catch { /* silent */ }
        }
    };

    const pauseTimer = () => setTimerState('paused');
    const resumeTimer = () => setTimerState('running');

    const resetTimer = async () => {
        if (currentSessionId) {
            try {
                await apiClient.endFocusSession(currentSessionId, false);
            } catch { /* silent */ }
            setCurrentSessionId(null);
        }
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
        ? 1 - timeLeft / (config.app.defaultBreakMinutes * 60)
        : 1 - timeLeft / (config.app.defaultPomodoroMinutes * 60);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
    }));

    const animatedOrbStyle = useAnimatedStyle(() => ({
        opacity: orbAnim.value,
    }));

    const gradientColors = isBreak ? theme.gradients.success : theme.gradients.brand;

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={[palette.bgDeep, palette.bg]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <Animated.View style={[styles.orbWrap, animatedOrbStyle]}>
                <GlowOrb
                    color={isBreak ? 'cyan' : 'indigo'}
                    size={500}
                    opacity={1}
                    style={{ top: -150, left: -100 }}
                />
                <GlowOrb
                    color={isBreak ? 'cyan' : 'pink'}
                    size={400}
                    opacity={1}
                    style={{ bottom: -100, right: -100 }}
                />
            </Animated.View>

            <SafeAreaView style={styles.safe}>
                <View style={styles.content}>
                    {/* Session info */}
                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionMode}>
                            {isBreak ? 'Mola Zamanı' : 'Odaklanma Modu'}
                        </Text>
                        <Text style={styles.sessionCount}>
                            Oturum {sessionsCompleted + 1} / 4
                        </Text>
                    </View>

                    {/* Timer Circle with gradient ring */}
                    <Animated.View style={[styles.timerWrapper, animatedStyle]}>
                        {/* Gradient progress ring (full) */}
                        <LinearGradient
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.ringOuter}
                        >
                            <View style={styles.ringInner} />
                        </LinearGradient>

                        {/* Inner dark circle with time */}
                        <View style={styles.timerInner}>
                            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                            <Text style={styles.timerLabel}>
                                {isBreak ? 'Dinlen' : 'Odaklan'}
                            </Text>
                            <View style={styles.progressBarOuter}>
                                <LinearGradient
                                    colors={gradientColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Controls */}
                    <View style={styles.controls}>
                        {timerState === 'idle' && (
                            <Pressable
                                onPress={startTimer}
                                style={({ pressed }) => [styles.mainBtnShadow, pressed && styles.btnPressed]}
                            >
                                <LinearGradient
                                    colors={gradientColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.mainBtn}
                                >
                                    <Ionicons name="play" size={36} color="#fff" />
                                </LinearGradient>
                            </Pressable>
                        )}

                        {timerState === 'running' && (
                            <Pressable
                                onPress={pauseTimer}
                                style={({ pressed }) => [styles.mainBtnShadow, pressed && styles.btnPressed]}
                            >
                                <LinearGradient
                                    colors={theme.gradients.sunset}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.mainBtn}
                                >
                                    <Ionicons name="pause" size={36} color="#fff" />
                                </LinearGradient>
                            </Pressable>
                        )}

                        {timerState === 'paused' && (
                            <View style={styles.pausedControls}>
                                <Pressable onPress={resetTimer} style={styles.secondaryBtn}>
                                    <Ionicons name="refresh" size={26} color={palette.textSecondary} />
                                </Pressable>
                                <Pressable
                                    onPress={resumeTimer}
                                    style={({ pressed }) => [styles.mainBtnShadow, pressed && styles.btnPressed]}
                                >
                                    <LinearGradient
                                        colors={gradientColors}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.mainBtn}
                                    >
                                        <Ionicons name="play" size={36} color="#fff" />
                                    </LinearGradient>
                                </Pressable>
                                <View style={styles.btnPlaceholder} />
                            </View>
                        )}
                    </View>

                    {/* Stats card */}
                    <GlassCard padding="lg" style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{sessionsCompleted}</Text>
                                <Text style={styles.statLabel}>Oturum</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{totalMinutes}</Text>
                                <Text style={styles.statLabel}>Dakika</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    +{sessionsCompleted * config.xp.focusSessionComplete}
                                </Text>
                                <Text style={styles.statLabel}>XP</Text>
                            </View>
                        </View>
                    </GlassCard>

                    {/* Current task indicator */}
                    <View style={styles.currentTask}>
                        <Ionicons name="bookmark" size={14} color={palette.primaryLight} />
                        <Text style={styles.currentTaskText} numberOfLines={1}>
                            {activeTasks.length > 0 ? activeTasks[0].title : 'Görev seçilmedi'}
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const RING_SIZE = 300;
const RING_INNER = 280;
const RING_BORDER = (RING_SIZE - RING_INNER) / 2;

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: palette.bg },
    safe: { flex: 1 },
    orbWrap: { ...StyleSheet.absoluteFillObject },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing['3xl'],
    },
    sessionInfo: {
        alignItems: 'center',
        marginBottom: theme.spacing['2xl'],
    },
    sessionMode: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: palette.textPrimary,
        letterSpacing: 0.5,
    },
    sessionCount: {
        fontSize: theme.fontSize.sm,
        color: palette.textMuted,
        marginTop: 4,
        letterSpacing: 0.5,
    },
    timerWrapper: {
        width: RING_SIZE,
        height: RING_SIZE,
        marginBottom: theme.spacing['2xl'],
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 40,
        elevation: 15,
    },
    ringOuter: {
        position: 'absolute',
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        padding: RING_BORDER,
    },
    ringInner: {
        flex: 1,
        backgroundColor: palette.bg,
        borderRadius: RING_INNER / 2,
    },
    timerInner: {
        width: RING_INNER - 12,
        height: RING_INNER - 12,
        borderRadius: (RING_INNER - 12) / 2,
        backgroundColor: 'rgba(19, 19, 43, 0.85)',
        borderWidth: 1,
        borderColor: palette.glassBorder,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    timerText: {
        fontSize: 64,
        fontWeight: theme.fontWeight.bold,
        color: palette.textPrimary,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1,
    },
    timerLabel: {
        fontSize: theme.fontSize.base,
        color: palette.textSecondary,
        marginTop: 4,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    progressBarOuter: {
        marginTop: theme.spacing.lg,
        width: 140,
        height: 4,
        backgroundColor: palette.glass,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    controls: {
        marginBottom: theme.spacing.xl,
    },
    mainBtnShadow: {
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 12,
        borderRadius: 44,
    },
    btnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.96 }],
    },
    mainBtn: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pausedControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xl,
    },
    secondaryBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: palette.glassStrong,
        borderWidth: 1,
        borderColor: palette.glassBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPlaceholder: {
        width: 56,
    },
    statsCard: {
        width: '100%',
        marginBottom: theme.spacing.base,
    },
    statsRow: {
        flexDirection: 'row',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: theme.fontSize['2xl'],
        fontWeight: theme.fontWeight.bold,
        color: palette.primaryLight,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: theme.fontSize.xs,
        color: palette.textMuted,
        marginTop: 2,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        backgroundColor: palette.glassBorder,
    },
    currentTask: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        backgroundColor: palette.glass,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: palette.glassBorder,
    },
    currentTaskText: {
        fontSize: theme.fontSize.sm,
        color: palette.textSecondary,
        maxWidth: 220,
    },
});
