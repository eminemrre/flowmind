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
    Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, palette } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuthStore();

    const handleRegister = async () => {
        if (!name.trim()) {
            Alert.alert('Hata', 'İsim gerekli');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Hata', 'E-posta adresi gerekli');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Hata', 'Şifre en az 8 karakter olmalı');
            return;
        }

        setLoading(true);
        const { success, error } = await register(email.trim(), password, name.trim());
        setLoading(false);

        if (success) {
            router.replace('/(onboarding)/welcome');
        } else {
            Alert.alert('Kayıt Başarısız', error || 'Bir hata oluştu');
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
            <GlowOrb color="pink" size={420} opacity={0.3} style={{ top: -120, right: -100 }} />
            <GlowOrb color="indigo" size={380} opacity={0.3} style={{ bottom: -100, left: -80 }} />
            <GlowOrb color="cyan" size={240} opacity={0.18} style={{ top: '45%', left: -80 }} />

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
                        <View style={styles.hero}>
                            <Text style={styles.title}>Hesap Oluştur</Text>
                            <Text style={styles.subtitle}>FlowMind ile verimliliğini artır</Text>
                        </View>

                        <GlassCard padding="xl" glow="pink" style={styles.formCard}>
                            <Text style={styles.label}>İsim</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Adın"
                                placeholderTextColor={palette.textDim}
                                value={name}
                                onChangeText={setName}
                            />

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
                                placeholder="En az 8 karakter"
                                placeholderTextColor={palette.textDim}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <View style={{ height: theme.spacing.md }} />

                            <Button
                                title="Kayıt Ol"
                                onPress={handleRegister}
                                loading={loading}
                                fullWidth
                                size="lg"
                            />

                            <Pressable
                                onPress={() => router.push('/(auth)/login')}
                                style={({ pressed }) => [styles.loginCta, pressed && styles.loginCtaPressed]}
                            >
                                <Text style={styles.loginText}>
                                    Zaten hesabın var mı?{' '}
                                    <Text style={styles.loginLink}>Giriş Yap</Text>
                                </Text>
                            </Pressable>
                        </GlassCard>

                        <Text style={styles.footer}>
                            Kayıt olarak Gizlilik Politikamızı kabul ediyorsun
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: palette.bg },
    safe: { flex: 1 },
    kbView: { flex: 1 },
    scroll: { flexGrow: 1, padding: theme.spacing.xl, justifyContent: 'center' },
    hero: {
        marginBottom: theme.spacing['2xl'],
        alignItems: 'flex-start',
    },
    title: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: theme.fontWeight.bold,
        color: palette.textPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: theme.fontSize.base,
        color: palette.textSecondary,
        marginTop: 4,
    },
    formCard: { marginBottom: theme.spacing.xl },
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
    loginCta: {
        marginTop: theme.spacing.lg,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
    },
    loginCtaPressed: { opacity: 0.6 },
    loginText: {
        fontSize: theme.fontSize.base,
        color: palette.textSecondary,
        textAlign: 'center',
    },
    loginLink: {
        color: palette.pink,
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
