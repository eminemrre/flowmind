import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Switch,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/components/ThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Theme } from '@/constants/theme';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function ProfileScreen() {
    const { user, logout, checkAuth } = useAuthStore();
    const { theme, isDark } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    // Mock settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Çıkış Yap',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    const handleUpdateProfile = async () => {
        if (!name.trim()) return;

        setLoading(true);
        try {
            const { error } = await apiClient.updateProfile({ name });
            if (error) {
                Alert.alert('Hata', 'Profil güncellenemedi.');
            } else {
                await checkAuth(); // Refresh user data
                setIsEditing(false);
                Alert.alert('Başarılı', 'Profiliniz güncellendi.');
            }
        } catch (error) {
            Alert.alert('Hata', 'Bir sorun oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const getAvatarUrl = () => {
        if (user?.avatar_url) return { uri: user.avatar_url };
        return { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random` };
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header / Avatar Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image source={getAvatarUrl()} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {isEditing ? (
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="İsim Soyisim"
                                placeholderTextColor={theme.colors.gray400}
                            />
                            <View style={styles.editActions}>
                                <Button
                                    title="İptal"
                                    onPress={() => setIsEditing(false)}
                                    variant="outline"
                                    size="sm"
                                />
                                <Button
                                    title="Kaydet"
                                    onPress={handleUpdateProfile}
                                    loading={loading}
                                    size="sm"
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{user?.name || 'Kullanıcı'}</Text>
                            <Text style={styles.email}>{user?.email}</Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => {
                                    setName(user?.name || '');
                                    setIsEditing(true);
                                }}
                            >
                                <Text style={styles.editButtonText}>Profili Düzenle</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Stats Summary */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.level || 1}</Text>
                        <Text style={styles.statLabel}>Seviye</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.total_xp || 0}</Text>
                        <Text style={styles.statLabel}>XP</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user?.current_streak || 0}🔥</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ayarlar</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
                            <Text style={styles.settingText}>Bildirimler</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: theme.colors.gray200, true: theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="volume-medium-outline" size={24} color={theme.colors.text} />
                            <Text style={styles.settingText}>Ses Efektleri</Text>
                        </View>
                        <Switch
                            value={soundEnabled}
                            onValueChange={setSoundEnabled}
                            trackColor={{ false: theme.colors.gray200, true: theme.colors.primary }}
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Yakında', 'Tema ayarları yakında eklenecek.')}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="moon-outline" size={24} color={theme.colors.text} />
                            <Text style={styles.settingText}>Görünüm</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>{isDark ? 'Karanlık' : 'Aydınlık'}</Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Destek</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.menuText}>Yardım Merkezi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="star-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.menuText}>Bizi Değerlendirin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.menuText}>Gizlilik Politikası</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Çıkış Yap"
                    onPress={handleLogout}
                    variant="ghost"
                    style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing['4xl'] }}
                    textStyle={{ color: theme.colors.error }}
                />

                <Text style={styles.version}>v1.0.0 (Build 2026.02)</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.base,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: theme.colors.surface,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    infoContainer: {
        alignItems: 'center',
    },
    name: {
        fontSize: theme.fontSize['2xl'],
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    editButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    editButtonText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
    },
    editContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 44,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    editActions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        ...theme.shadow.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
    },
    section: {
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadow.sm,
    },
    sectionTitle: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.base,
        marginTop: theme.spacing.base,
        marginBottom: theme.spacing.sm,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    settingText: {
        fontSize: theme.fontSize.base,
        color: theme.colors.text,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    settingValue: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.base,
        gap: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuText: {
        fontSize: theme.fontSize.base,
        color: theme.colors.text,
    },
    version: {
        textAlign: 'center',
        color: theme.colors.gray400,
        fontSize: theme.fontSize.xs,
    },
});
