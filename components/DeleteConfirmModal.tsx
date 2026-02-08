import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface DeleteConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

export default function DeleteConfirmModal({
    visible,
    onClose,
    onConfirm,
    taskTitle,
}: DeleteConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="trash-outline" size={40} color="#EF4444" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Görevi Sil</Text>

                    {/* Message */}
                    <Text style={styles.message}>
                        <Text style={styles.taskName}>"{taskTitle}"</Text> görevini silmek istediğine emin misin?
                    </Text>
                    <Text style={styles.warning}>Bu işlem geri alınamaz.</Text>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            <Ionicons name="trash" size={18} color="#fff" />
                            <Text style={styles.deleteButtonText}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    message: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    taskName: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    warning: {
        fontSize: 13,
        color: '#EF4444',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.lg,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        width: '100%',
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
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
