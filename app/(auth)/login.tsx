import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();

    const handleLogin = async () => {
        // Validation
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>🧠</Text>
                        <Text style={styles.appName}>FlowMind</Text>
                        <Text style={styles.tagline}>Akışa gir, akışta kal</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.label}>E-posta</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ornek@email.com"
                            placeholderTextColor={theme.colors.gray400}
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
                            placeholderTextColor={theme.colors.gray400}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                        </TouchableOpacity>

                        <Button
                            title="Giriş Yap"
                            onPress={handleLogin}
                            loading={loading}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>veya</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Logins */}
                    <Button
                        title="Apple ile Devam Et"
                        onPress={() => Alert.alert('Yakında', 'Apple Sign-In yakında eklenecek!')}
                        variant="secondary"
                        fullWidth
                    />

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Hesabın yok mu? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Kayıt Ol</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    keyboardView: { flex: 1 },
    content: { flex: 1, padding: theme.spacing.xl, justifyContent: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: theme.spacing['3xl'] },
    logo: { fontSize: 64, marginBottom: theme.spacing.md },
    appName: { fontSize: theme.fontSize['3xl'], fontWeight: theme.fontWeight.bold, color: theme.colors.gray900 },
    tagline: { fontSize: theme.fontSize.base, color: theme.colors.gray500 },
    form: { marginBottom: theme.spacing.xl },
    label: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.gray700, marginBottom: theme.spacing.xs },
    input: { backgroundColor: theme.colors.gray50, borderWidth: 1, borderColor: theme.colors.gray200, borderRadius: theme.borderRadius.lg, padding: theme.spacing.base, fontSize: theme.fontSize.base, marginBottom: theme.spacing.base, color: theme.colors.gray900 },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: theme.spacing.xl },
    forgotPasswordText: { fontSize: theme.fontSize.sm, color: theme.colors.primary },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.xl },
    dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.gray200 },
    dividerText: { paddingHorizontal: theme.spacing.md, color: theme.colors.gray400, fontSize: theme.fontSize.sm },
    registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.xl },
    registerText: { color: theme.colors.gray500 },
    registerLink: { color: theme.colors.primary, fontWeight: theme.fontWeight.semibold },
});
