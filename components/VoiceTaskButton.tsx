import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { aiService } from '@/lib/ai';
import { useTaskStore } from '@/stores/taskStore';
import { useTheme } from '@/components/ThemeProvider';

interface VoiceTaskButtonProps {
    style?: any;
}

export function VoiceTaskButton({ style }: VoiceTaskButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { createTask } = useTaskStore();
    const { theme } = useTheme();

    const handleParse = async () => {
        if (!text.trim()) return;

        setIsProcessing(true);
        try {
            const parsed = await aiService.parseVoiceToTask(text.trim());
            if (parsed && parsed.title) {
                const success = await createTask({
                    title: parsed.title,
                    priority: parsed.priority || 'medium',
                    estimatedMinutes: parsed.estimatedMinutes || 30,
                    category: parsed.category || 'general',
                });

                if (success) {
                    Alert.alert('✅ Görev Oluşturuldu', `"${parsed.title}" başarıyla eklendi!`);
                    setText('');
                    setIsOpen(false);
                } else {
                    Alert.alert('Hata', 'Görev oluşturulamadı.');
                }
            } else {
                Alert.alert('🤔 Anlaşılamadı', 'Lütfen daha açık ifade edin. Örnek: "Yarın toplantı için sunum hazırla"');
            }
        } catch {
            Alert.alert('Hata', 'AI yanıt veremedi. Tekrar deneyin.');
        }
        setIsProcessing(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.colors.primary }, style]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="mic" size={28} color="#FFF" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                                🎙️ Sesli Görev Ekle
                            </Text>
                            <TouchableOpacity onPress={() => setIsOpen(false)}>
                                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
                            Görevinizi doğal dille yazın, AI otomatik ayrıştırsın.
                        </Text>

                        <TextInput
                            style={[styles.input, {
                                backgroundColor: theme.colors.surface,
                                color: theme.colors.text,
                                borderColor: theme.colors.border,
                            }]}
                            placeholder={'Örn: "Yarın saat 3te müdürle toplantı"'}
                            placeholderTextColor={theme.colors.gray400}
                            value={text}
                            onChangeText={setText}
                            multiline
                            autoFocus
                        />

                        <View style={styles.examples}>
                            {['Bugün spor yap', 'Rapor hazırla 2 saat', 'Acil mail gönder'].map((example) => (
                                <TouchableOpacity
                                    key={example}
                                    style={[styles.exampleChip, { backgroundColor: theme.colors.surface }]}
                                    onPress={() => setText(example)}
                                >
                                    <Text style={[styles.exampleText, { color: theme.colors.primary }]}>{example}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.parseButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handleParse}
                            disabled={isProcessing || !text.trim()}
                        >
                            {isProcessing ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Ionicons name="sparkles" size={20} color="#FFF" />
                                    <Text style={styles.parseButtonText}>AI ile Oluştur</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    hint: {
        fontSize: 13,
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    examples: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    exampleChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    exampleText: {
        fontSize: 13,
        fontWeight: '500',
    },
    parseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 14,
        gap: 8,
    },
    parseButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
