import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface EnergyBarProps {
    level: number; // 1-5
    showLabel?: boolean;
}

const levelLabels = [
    'Çok Düşük',
    'Düşük',
    'Orta',
    'Yüksek',
    'Çok Yüksek',
];

const levelColors = [
    theme.colors.energy1,
    theme.colors.energy2,
    theme.colors.energy3,
    theme.colors.energy4,
    theme.colors.energy5,
];

const levelSuggestions = [
    'Dinlenme zamanı, hafif işlerle idare et',
    'Rutin ve kolay görevler için uygun',
    'Normal tempo, her türlü iş yapılabilir',
    'Zorlu işler için ideal, odaklanmaya hazırsın',
    'En verimli dönemdesin! Derin çalışmaya dalabilirsin',
];

export function EnergyBar({ level, showLabel = true }: EnergyBarProps) {
    const normalizedLevel = Math.max(1, Math.min(5, Math.round(level)));
    const percentage = (normalizedLevel / 5) * 100;
    const color = levelColors[normalizedLevel - 1];
    const label = levelLabels[normalizedLevel - 1];
    const suggestion = levelSuggestions[normalizedLevel - 1];

    return (
        <View style={styles.container}>
            {showLabel && (
                <View style={styles.header}>
                    <Text style={styles.title}>Enerji Seviyesi</Text>
                    <Text style={[styles.levelText, { color }]}>{label}</Text>
                </View>
            )}

            <View style={styles.barContainer}>
                <View
                    style={[
                        styles.barFill,
                        { width: `${percentage}%`, backgroundColor: color }
                    ]}
                />
            </View>

            {showLabel && (
                <View style={styles.footer}>
                    <Text style={[styles.emoji]}>🔋</Text>
                    <Text style={styles.suggestion}>{suggestion}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        ...theme.shadow.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.gray600,
    },
    levelText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
    },
    barContainer: {
        height: 8,
        backgroundColor: theme.colors.gray100,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: theme.borderRadius.full,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    emoji: {
        fontSize: 16,
    },
    suggestion: {
        flex: 1,
        fontSize: theme.fontSize.xs,
        color: theme.colors.gray500,
    },
});
