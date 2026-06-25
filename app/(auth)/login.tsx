import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    Image,
    Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, palette } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Hata', 'E-posta adresi gerekli');
            return;
        }
        if (!password) {
            Alert.alert('Hata', 'Şifre gerekli');
            return;
        }

        setLoading(true);
        const { success, error } = await login(email.trim(), password);
        setLoading(false);

        if (success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Giriş Başarısız', error || 'Bir hata oluştu');
        }
    };

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={[palette.bgDeep, palette.bg, palette.bgElevated]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <GlowOrb color="indigo" size={420} opacity={0.35} style={{ top: -120, left: -100 }} />
            <GlowOrb color="pink" size={380} opacity={0.25} style={{ bottom: -100, right: -80 }} />
            <GlowOrb color="cyan" size={260} opacity={0.2} style={{ top: '40%', right: -100 }} />

            <SafeAreaView style={styles.safe}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.kbView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Hero / Logo */}
                        <View style={styles.hero}>
                            <View style={styles.logoGlow}>
                                <Image
                                    source={require('@/assets/icon.png')}
                                    style={styles.logo}
                                />
                            </View>
                            <Text style={styles.appName}>FlowMind</Text>
                            <Text style={styles.tagline}>Enerji ritmine göre çalış</Text>
                        </View>

                        {/* Form */}
                        <GlassCard padding="xl" glow="indigo" style={styles.formCard}>
                            <Text style={styles.label}>E-posta</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ornek@email.com"
                                placeholderTextColor={palette.textDim}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />

                            <Text style={styles.label}>Şifre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={palette.textDim}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <Pressable style={styles.forgot} hitSlop={8}>
                                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
                            </Pressable>

                            <Button
                                title="Giriş Yap"
                                onPress={handleLogin}
                                loading={loading}
                                fullWidth
                                size="lg"
                            />

                            <Pressable
                                onPress={() => router.push('/(auth)/register')}
                                style={({ pressed }) => [styles.registerCta, pressed && styles.registerCtaPressed]}
                            >
                                <Text style={styles.registerText}>
                                    Hesabın yok mu?{' '}
                                    <Text style={styles.registerLink}>Kayıt Ol</Text>
                                </Text>
                            </Pressable>
                        </GlassCard>

                        <Text style={styles.footer}>
                            Verilerin Türkiye'de güvende
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: palette.bg,
    },
    safe: {
        flex: 1,
    },
    kbView: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
    },
    hero: {
        alignItems: 'center',
        marginBottom: theme.spacing['2xl'],
    },
    logoGlow: {
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 12,
        marginBottom: theme.spacing.lg,
    },
    logo: {
        width: 96,
        height: 96,
        borderRadius: 22,
    },
    appName: {
        fontSize: theme.fontSize['4xl'],
        fontWeight: theme.fontWeight.bold,
        color: palette.textPrimary,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: theme.fontSize.base,
        color: palette.textSecondary,
        marginTop: 4,
        letterSpacing: 0.3,
    },
    formCard: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: palette.textSecondary,
        marginBottom: theme.spacing.xs,
        letterSpacing: 0.3,
    },
    input: {
        backgroundColor: palette.glass,
        borderWidth: 1,
        borderColor: palette.glassBorder,
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.base,
        fontSize: theme.fontSize.base,
        marginBottom: theme.spacing.base,
        color: palette.textPrimary,
    },
    forgot: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
        padding: 4,
    },
    forgotText: {
        fontSize: theme.fontSize.sm,
        color: palette.primaryLight,
        fontWeight: theme.fontWeight.medium,
    },
    registerCta: {
        marginTop: theme.spacing.lg,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
    },
    registerCtaPressed: {
        opacity: 0.6,
    },
    registerText: {
        fontSize: theme.fontSize.base,
        color: palette.textSecondary,
        textAlign: 'center',
    },
    registerLink: {
        color: palette.primaryLight,
        fontWeight: theme.fontWeight.semibold,
    },
    footer: {
        textAlign: 'center',
        fontSize: theme.fontSize.xs,
        color: palette.textMuted,
        marginTop: theme.spacing.lg,
        letterSpacing: 0.5,
    },
});
