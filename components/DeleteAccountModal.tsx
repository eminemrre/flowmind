import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeProvider';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Theme, palette } from '@/constants/theme';

interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
    /** Parola doğruysa sunucu silme işlemini yapar. Hata mesajı dönerse gösterilir. */
    onConfirm: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const DELETE_SCOPE = [
    'Tüm görevlerin ve tamamlanma geçmişin',
    'Odak (Pomodoro) oturumların',
    'Enerji kayıtların ve istatistiklerin',
    'XP, seviye, seri ve rozetlerin',
    'Hesap bilgilerin (e-posta, ad, parola)',
];

export default function DeleteAccountModal({ visible, onClose, onConfirm }: DeleteAccountModalProps) {
    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modal her açıldığında alanları sıfırla
    useEffect(() => {
        if (visible) {
            setPassword('');
            setError(null);
            setIsDeleting(false);
        }
    }, [visible]);

    const handleConfirm = async () => {
        if (!password || isDeleting) return;

        setIsDeleting(true);
        setError(null);

        const result = await onConfirm(password);

        // Başarılıysa ebeveyn ekranı yönlendirir; bileşen yalnızca hatayı gösterir
        if (!result.success) {
            setError(result.error || 'Hesap silinemedi.');
            setIsDeleting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={isDeleting ? undefined : onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="trash-outline" size={32} color={theme.colors.error} />
                    </View>

                    <Text style={styles.title}>Hesabımı Sil</Text>
                    <Text style={styles.message}>
                        Bu işlem <Text style={styles.strong}>geri alınamaz</Text>. Aşağıdaki
                        verileriniz sunucudan kalıcı olarak silinir:
                    </Text>

                    <View style={styles.list}>
                        {DELETE_SCOPE.map((item) => (
                            <View key={item} style={styles.listItem}>
                                <Ionicons name="close-circle" size={14} color={theme.colors.error} />
                                <Text style={styles.listText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.label}>Onaylamak için parolanızı girin</Text>
                    <TextInput
                        style={[styles.input, error ? styles.inputError : null]}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (error) setError(null);
                        }}
                        placeholder="Parola"
                        placeholderTextColor={theme.colors.gray400}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isDeleting}
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={isDeleting}
                        >
                            <Text style={styles.cancelButtonText}>Vazgeç</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.deleteButton,
                                (!password || isDeleting) && styles.deleteButtonDisabled,
                            ]}
                            onPress={handleConfirm}
                            disabled={!password || isDeleting}
                        >
                            {isDeleting ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <Ionicons name="trash" size={18} color="#fff" />
                                    <Text style={styles.deleteButtonText}>Kalıcı Olarak Sil</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    card: {
        backgroundColor: palette.glassStrong,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: palette.glassBorder,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth: 380,
        ...theme.shadow.lg,
    },
    iconContainer: {
        alignSelf: 'center',
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    message: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 21,
    },
    strong: {
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.error,
    },
    list: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        gap: 6,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    listText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    label: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
        marginBottom: 6,
    },
    input: {
        height: 46,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.text,
        backgroundColor: theme.colors.surface,
        fontSize: theme.fontSize.base,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    error: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.error,
        marginTop: 6,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.lg,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.xs,
    },
    cancelButton: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cancelButtonText: {
        fontSize: theme.fontSize.base,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    deleteButton: {
        backgroundColor: theme.colors.error,
    },
    deleteButtonDisabled: {
        opacity: 0.45,
    },
    deleteButtonText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: '#fff',
    },
});
