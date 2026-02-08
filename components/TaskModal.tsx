import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Task, EnergyLevel } from '@/types';

interface TaskModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    task?: Task | null;
    mode: 'add' | 'edit';
}

const CATEGORIES = [
    { id: 'work', name: 'İş', icon: 'briefcase', color: '#3B82F6' },
    { id: 'personal', name: 'Kişisel', icon: 'person', color: '#8B5CF6' },
    { id: 'health', name: 'Sağlık', icon: 'fitness', color: '#10B981' },
    { id: 'learning', name: 'Öğrenme', icon: 'book', color: '#F59E0B' },
    { id: 'other', name: 'Diğer', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

const PRIORITIES: { id: 'low' | 'medium' | 'high'; name: string; color: string }[] = [
    { id: 'low', name: 'Düşük', color: '#10B981' },
    { id: 'medium', name: 'Orta', color: '#F59E0B' },
    { id: 'high', name: 'Yüksek', color: '#EF4444' },
];

const ENERGY_LEVELS: { id: EnergyLevel; name: string; emoji: string }[] = [
    { id: 'low', name: 'Düşük', emoji: '😴' },
    { id: 'medium', name: 'Orta', emoji: '🙂' },
    { id: 'high', name: 'Yüksek', emoji: '🔥' },
];

export default function TaskModal({ visible, onClose, onSave, task, mode }: TaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('work');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
    const [estimatedMinutes, setEstimatedMinutes] = useState('25');

    useEffect(() => {
        if (task && mode === 'edit') {
            setTitle(task.title);
            setDescription(task.description || '');
            setCategory(task.category);
            setPriority(task.priority === 'urgent' ? 'high' : task.priority);
            setEnergyLevel(task.energyLevel);
            setEstimatedMinutes(task.estimatedMinutes?.toString() || '25');
        } else {
            resetForm();
        }
    }, [task, mode, visible]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('work');
        setPriority('medium');
        setEnergyLevel('medium');
        setEstimatedMinutes('25');
    };

    const handleSave = () => {
        if (!title.trim()) return;

        onSave({
            id: task?.id,
            title: title.trim(),
            description: description.trim() || null,
            category,
            priority,
            energyLevel,
            estimatedMinutes: parseInt(estimatedMinutes) || 25,
            isCompleted: task?.isCompleted || false,
        });

        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {mode === 'add' ? 'Yeni Görev' : 'Görevi Düzenle'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Kaydet</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Title Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Görev Adı *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ne yapacaksın?"
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    {/* Description Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Açıklama</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Detaylar..."
                            placeholderTextColor={theme.colors.textSecondary}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Category Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kategori</Text>
                        <View style={styles.optionsRow}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryButton,
                                        category === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color },
                                    ]}
                                    onPress={() => setCategory(cat.id)}
                                >
                                    <Ionicons
                                        name={cat.icon as any}
                                        size={20}
                                        color={category === cat.id ? cat.color : theme.colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            category === cat.id && { color: cat.color },
                                        ]}
                                    >
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Priority Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Öncelik</Text>
                        <View style={styles.priorityRow}>
                            {PRIORITIES.map((p) => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[
                                        styles.priorityButton,
                                        priority === p.id && { backgroundColor: p.color, borderColor: p.color },
                                    ]}
                                    onPress={() => setPriority(p.id)}
                                >
                                    <Text
                                        style={[
                                            styles.priorityText,
                                            priority === p.id && { color: '#fff' },
                                        ]}
                                    >
                                        {p.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Energy Level */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gereken Enerji Seviyesi</Text>
                        <View style={styles.energyRow}>
                            {ENERGY_LEVELS.map((e) => (
                                <TouchableOpacity
                                    key={e.id}
                                    style={[
                                        styles.energyButton,
                                        energyLevel === e.id && styles.energyButtonActive,
                                    ]}
                                    onPress={() => setEnergyLevel(e.id)}
                                >
                                    <Text style={styles.energyEmoji}>{e.emoji}</Text>
                                    <Text
                                        style={[
                                            styles.energyText,
                                            energyLevel === e.id && styles.energyTextActive,
                                        ]}
                                    >
                                        {e.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Estimated Time */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tahmini Süre (dakika)</Text>
                        <View style={styles.timeRow}>
                            {['15', '25', '45', '60', '90'].map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeButton,
                                        estimatedMinutes === time && styles.timeButtonActive,
                                    ]}
                                    onPress={() => setEstimatedMinutes(time)}
                                >
                                    <Text
                                        style={[
                                            styles.timeText,
                                            estimatedMinutes === time && styles.timeTextActive,
                                        ]}
                                    >
                                        {time}dk
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Spacer for keyboard */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    saveButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: theme.spacing.md,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: theme.spacing.xs,
    },
    categoryText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    priorityButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    priorityText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textSecondary,
    },
    energyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.sm,
    },
    energyButton: {
        flex: 1,
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    energyButtonActive: {
        backgroundColor: theme.colors.primary + '20',
        borderColor: theme.colors.primary,
    },
    energyEmoji: {
        fontSize: 28,
        marginBottom: 4,
    },
    energyText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    energyTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    timeRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    timeButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    timeButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    timeText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    timeTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
});
