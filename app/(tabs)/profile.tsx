import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

export default function ProfileScreen() {
    const { user, subscription } = useAuthStore();
    const isPro = subscription?.isActive && subscription.planType !== 'free';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name?.charAt(0) || '👤'}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>🔥 {user?.currentStreak || 0}</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>⭐ {user?.level || 1}</Text>
                            <Text style={styles.statLabel}>Level</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>💎 {user?.totalXp || 0}</Text>
                            <Text style={styles.statLabel}>XP</Text>
                        </View>
                    </View>
                </View>

                {/* Subscription Banner */}
                {!isPro && (
                    <TouchableOpacity style={styles.proBanner}>
                        <View style={styles.proContent}>
                            <Text style={styles.proTitle}>✨ FlowMind Pro</Text>
                            <Text style={styles.proSubtitle}>Sınırsız AI, advanced analytics ve daha fazlası</Text>
                        </View>
                        <Text style={styles.proPrice}>$6.99/ay</Text>
                    </TouchableOpacity>
                )}

                {/* Settings Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuTitle}>Ayarlar</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="notifications-outline" size={22} color={theme.colors.gray600} />
                        <Text style={styles.menuText}>Bildirimler</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="fitness-outline" size={22} color={theme.colors.gray600} />
                        <Text style={styles.menuText}>Apple Health</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="color-palette-outline" size={22} color={theme.colors.gray600} />
                        <Text style={styles.menuText}>Tema</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="time-outline" size={22} color={theme.colors.gray600} />
                        <Text style={styles.menuText}>Çalışma Tercihleri</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                    </TouchableOpacity>
                </View>

                {/* Support Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuTitle}>Destek</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={22} color={theme.colors.gray600} />
                        <Text style={styles.menuText}>Yardım</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="mail-outline" size={22} color={theme.colors.gray600} />
                        <Text style={styles.menuText}>Geri Bildirim</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <Button title="Çıkış Yap" onPress={() => { }} variant="outline" fullWidth style={styles.logoutButton} />

                <Text style={styles.version}>FlowMind v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.gray50 },
    scrollView: { flex: 1 },
    content: { padding: theme.spacing.base, paddingBottom: theme.spacing['4xl'] },
    profileCard: { backgroundColor: '#fff', borderRadius: theme.borderRadius.xl, padding: theme.spacing.xl, alignItems: 'center', marginBottom: theme.spacing.base, ...theme.shadow.sm },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md },
    avatarText: { fontSize: 32, color: '#fff' },
    userName: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.gray900 },
    userEmail: { fontSize: theme.fontSize.sm, color: theme.colors.gray500, marginBottom: theme.spacing.base },
    statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', paddingTop: theme.spacing.base, borderTopWidth: 1, borderTopColor: theme.colors.gray100 },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.gray800 },
    statLabel: { fontSize: theme.fontSize.xs, color: theme.colors.gray500 },
    statDivider: { width: 1, backgroundColor: theme.colors.gray100 },
    proBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl, padding: theme.spacing.base, marginBottom: theme.spacing.base },
    proContent: { flex: 1 },
    proTitle: { fontSize: theme.fontSize.base, fontWeight: theme.fontWeight.bold, color: '#fff' },
    proSubtitle: { fontSize: theme.fontSize.xs, color: 'rgba(255,255,255,0.8)' },
    proPrice: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: '#fff' },
    menuSection: { backgroundColor: '#fff', borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.base, overflow: 'hidden' },
    menuTitle: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray500, padding: theme.spacing.base, paddingBottom: theme.spacing.sm },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.base, borderTopWidth: 1, borderTopColor: theme.colors.gray50 },
    menuText: { flex: 1, fontSize: theme.fontSize.base, color: theme.colors.gray800, marginLeft: theme.spacing.md },
    logoutButton: { marginTop: theme.spacing.xl },
    version: { textAlign: 'center', fontSize: theme.fontSize.xs, color: theme.colors.gray400, marginTop: theme.spacing.xl },
});
