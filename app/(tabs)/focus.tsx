import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { config } from '@/constants/config';

type TimerState = 'idle' | 'running' | 'paused' | 'break';

export default function FocusScreen() {
    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [timeLeft, setTimeLeft] = useState(config.app.defaultPomodoroMinutes * 60);
    const [isBreak, setIsBreak] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Animation for timer
    useEffect(() => {
        if (timerState === 'running') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [timerState]);

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (timerState === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [timerState, timeLeft]);

    const handleTimerComplete = () => {
        if (isBreak) {
            // Break finished, start new session
            setIsBreak(false);
            setTimeLeft(config.app.defaultPomodoroMinutes * 60);
            setTimerState('idle');
        } else {
            // Work session finished
            setSessionsCompleted(prev => prev + 1);
            const isLongBreak = (sessionsCompleted + 1) % config.app.sessionsUntilLongBreak === 0;
            setIsBreak(true);
            setTimeLeft(isLongBreak ? config.app.longBreakMinutes * 60 : config.app.defaultBreakMinutes * 60);
            setTimerState('idle');
        }
    };

    const startTimer = () => setTimerState('running');
    const pauseTimer = () => setTimerState('paused');
    const resumeTimer = () => setTimerState('running');
    const resetTimer = () => {
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
                        { transform: [{ scale: pulseAnim }] }
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

                    {/* Progress ring would go here */}
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
                                <Ionicons name="refresh" size={28} color={theme.colors.gray600} />
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
                        <Text style={styles.statValue}>{sessionsCompleted * 25}</Text>
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
                    <Ionicons name="bookmark-outline" size={16} color={theme.colors.gray400} />
                    <Text style={styles.currentTaskText}>
                        Görev seçilmedi - Genel odaklanma
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.gray50,
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
        color: theme.colors.gray800,
    },
    sessionCount: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.gray500,
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadow.lg,
    },
    timerCircleBreak: {
        backgroundColor: theme.colors.success + '10',
    },
    timerText: {
        fontSize: 56,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.gray900,
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        fontSize: theme.fontSize.base,
        color: theme.colors.gray500,
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
        backgroundColor: theme.colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        width: 56,
    },
    stats: {
        flexDirection: 'row',
        backgroundColor: '#fff',
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
        color: theme.colors.gray500,
        marginTop: theme.spacing.xs,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.gray200,
    },
    currentTask: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        gap: theme.spacing.sm,
    },
    currentTaskText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.gray500,
    },
});
