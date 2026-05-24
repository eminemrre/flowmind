import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuthStore();

    const handleRegister = async () => {
        // Validation
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Hesap Oluştur</Text>
                        <Text style={styles.subtitle}>FlowMind ile verimliliğini artır</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>İsim</Text>
                        <TextInput style={styles.input} placeholder="Adın" placeholderTextColor={theme.colors.gray400} value={name} onChangeText={setName} />

                        <Text style={styles.label}>E-posta</Text>
                        <TextInput style={styles.input} placeholder="ornek@email.com" placeholderTextColor={theme.colors.gray400} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={setEmail} />

                        <Text style={styles.label}>Şifre</Text>
                        <TextInput style={styles.input} placeholder="En az 8 karakter" placeholderTextColor={theme.colors.gray400} secureTextEntry value={password} onChangeText={setPassword} />

                        <Button title="Kayıt Ol" onPress={handleRegister} loading={loading} fullWidth size="lg" style={styles.button} />
                    </View>

                    <Pressable
                        onPress={() => router.push('/(auth)/login')}
                        style={({ pressed }) => [styles.loginCta, pressed && styles.loginCtaPressed]}
                    >
                        <Text style={styles.loginCtaText}>
                            Zaten hesabın var mı? <Text style={styles.loginCtaTextBold}>Giriş Yap</Text>
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    keyboardView: { flex: 1 },
    content: { flex: 1, padding: theme.spacing.xl, justifyContent: 'center' },
    header: { marginBottom: theme.spacing['2xl'] },
    title: { fontSize: theme.fontSize['2xl'], fontWeight: theme.fontWeight.bold, color: theme.colors.gray900 },
    subtitle: { fontSize: theme.fontSize.base, color: theme.colors.gray500, marginTop: theme.spacing.xs },
    form: { marginBottom: theme.spacing.xl },
    label: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.gray700, marginBottom: theme.spacing.xs },
    input: { backgroundColor: theme.colors.gray50, borderWidth: 1, borderColor: theme.colors.gray200, borderRadius: theme.borderRadius.lg, padding: theme.spacing.base, fontSize: theme.fontSize.base, marginBottom: theme.spacing.base, color: theme.colors.gray900 },
    button: { marginTop: theme.spacing.md },
    loginCta: { marginTop: theme.spacing.md, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.base, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.gray50, borderWidth: 1, borderColor: theme.colors.gray200 },
    loginCtaPressed: { opacity: 0.6, backgroundColor: theme.colors.gray100 },
    loginCtaText: { fontSize: theme.fontSize.base, color: theme.colors.gray700, textAlign: 'center' },
    loginCtaTextBold: { color: theme.colors.primary, fontWeight: theme.fontWeight.semibold },
});
