import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/stores/authStore';

export default function StatsScreen() {
    const { user } = useAuthStore();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Week Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📈 Bu Hafta</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>Görev</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Saat</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>7</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                    </View>
                </View>

                {/* Level Progress */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🎮 Seviye İlerlemesi</Text>
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>Level {user?.level || 1}</Text>
                        <View style={styles.xpBar}>
                            <View style={[styles.xpFill, { width: `${(user?.totalXp || 0) % 100}%` }]} />
                        </View>
                        <Text style={styles.xpText}>{(user?.totalXp || 0) % 100}/100 XP</Text>
                    </View>
                </View>

                {/* Productivity Chart Placeholder */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>⏱️ Verimlilik Saatleri</Text>
                    <View style={styles.chartPlaceholder}>
                        <Text style={styles.placeholderText}>
                            📊 Grafik burada gösterilecek
                        </Text>
                        <Text style={styles.placeholderSubtext}>
                            En verimli saatleriniz: 09:00 - 11:00
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.gray50 },
    scrollView: { flex: 1 },
    content: { padding: theme.spacing.base, paddingBottom: theme.spacing['4xl'] },
    card: { backgroundColor: '#fff', borderRadius: theme.borderRadius.xl, padding: theme.spacing.base, marginBottom: theme.spacing.base, ...theme.shadow.sm },
    cardTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray800, marginBottom: theme.spacing.md },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: theme.fontSize['3xl'], fontWeight: theme.fontWeight.bold, color: theme.colors.primary },
    statLabel: { fontSize: theme.fontSize.sm, color: theme.colors.gray500 },
    levelContainer: { alignItems: 'center' },
    levelText: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.gray800, marginBottom: theme.spacing.sm },
    xpBar: { width: '100%', height: 12, backgroundColor: theme.colors.gray100, borderRadius: theme.borderRadius.full, overflow: 'hidden' },
    xpFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.full },
    xpText: { fontSize: theme.fontSize.sm, color: theme.colors.gray500, marginTop: theme.spacing.sm },
    chartPlaceholder: { alignItems: 'center', paddingVertical: theme.spacing['2xl'], backgroundColor: theme.colors.gray50, borderRadius: theme.borderRadius.lg },
    placeholderText: { fontSize: theme.fontSize.base, color: theme.colors.gray400 },
    placeholderSubtext: { fontSize: theme.fontSize.sm, color: theme.colors.primary, marginTop: theme.spacing.sm },
});
