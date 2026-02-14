import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';

const { width } = Dimensions.get('window');

interface Question {
    id: string;
    title: string;
    subtitle: string;
    type: 'single' | 'time';
    options?: { label: string; value: string; icon: string }[];
}

const steps: Question[] = [
    {
        id: 'chronotype',
        title: 'Verimlilik Tarzın Ne?',
        subtitle: 'Biyolojik saatine göre sana en uygun çalışma planını oluşturacağız.',
        type: 'single',
        options: [
            { label: 'Sabah Kuşu 🌅', value: 'morning', icon: 'sunny' },
            { label: 'Gece Kuşu 🌙', value: 'evening', icon: 'moon' },
            { label: 'Dengeli ⚖️', value: 'intermediate', icon: 'bicycle' },
        ],
    },
    {
        id: 'workHours',
        title: 'Günde Kaç Saat?',
        subtitle: 'Derin çalışma (Deep Work) için ne kadar vakit ayırabilirsin?',
        type: 'single',
        options: [
            { label: 'Hafif (2-4 Saat)', value: '4', icon: 'cafe' },
            { label: 'Orta (4-6 Saat)', value: '6', icon: 'laptop' },
            { label: 'Yoğun (6-8+ Saat)', value: '8', icon: 'flame' },
        ],
    },
    {
        id: 'challenge',
        title: 'En Büyük Zorluğun?',
        subtitle: 'Sana özel AI koçluk ipuçları için bunu bilmemiz gerek.',
        type: 'single',
        options: [
            { label: 'Odaklanamama 😵‍💫', value: 'focus', icon: 'eye-off' },
            { label: 'Erteleme 🐢', value: 'procrastination', icon: 'hourglass' },
            { label: 'Enerji Düşüklüğü 🔋', value: 'energy', icon: 'battery-dead' },
        ],
    },
];

export default function WelcomeScreen() {
    const [stepIndex, setStepIndex] = useState(0);
    const [preferences, setLocalPreferences] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    const { setOnboardingComplete, setPreferences: setStorePreferences } = useAuthStore();

    const currentStep = steps[stepIndex];

    const handleSelect = (value: string) => {
        setLocalPreferences(prev => ({ ...prev, [currentStep.id]: value }));
    };

    const handleNext = async () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(prev => prev + 1);
        } else {
            await finishOnboarding();
        }
    };

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex(prev => prev - 1);
        }
    };

    const finishOnboarding = async () => {
        setLoading(true);
        try {
            // Prepare data for backend
            const prefs = {
                chronotype: preferences.chronotype || 'intermediate',
                workHoursPerDay: parseInt(preferences.workHours || '6'),
                // other fields logic...
            };

            // Save to backend (mock call or real if endpoint exists)
            // await apiClient.updatePreferences(prefs); 
            // For now, we update store locally

            // setStorePreferences(prefs as any);

            setOnboardingComplete(true);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Onboarding error:', error);
            // Fallback
            setOnboardingComplete(true);
            router.replace('/(tabs)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {stepIndex > 0 && (
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.gray800} />
                    </TouchableOpacity>
                )}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${((stepIndex + 1) / steps.length) * 100}%` }]} />
                </View>
                <View style={{ width: 40 }} />
            </View>

            <Animated.View
                key={stepIndex}
                entering={SlideInRight}
                exiting={SlideOutLeft}
                style={styles.content}
            >
                <Text style={styles.stepIndicator}>ADIM {stepIndex + 1}/{steps.length}</Text>
                <Text style={styles.title}>{currentStep.title}</Text>
                <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

                <View style={styles.optionsContainer}>
                    {currentStep.options?.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.optionCard,
                                preferences[currentStep.id] === option.value && styles.optionCardSelected
                            ]}
                            onPress={() => handleSelect(option.value)}
                        >
                            <View style={[
                                styles.iconContainer,
                                preferences[currentStep.id] === option.value && styles.iconContainerSelected
                            ]}>
                                <Ionicons
                                    name={option.icon as any}
                                    size={24}
                                    color={preferences[currentStep.id] === option.value ? '#fff' : theme.colors.primary}
                                />
                            </View>
                            <Text style={[
                                styles.optionLabel,
                                preferences[currentStep.id] === option.value && styles.optionLabelSelected
                            ]}>
                                {option.label}
                            </Text>

                            {preferences[currentStep.id] === option.value && (
                                <View style={styles.checkIcon}>
                                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <Button
                    title={stepIndex === steps.length - 1 ? "Başla! 🚀" : "Devam Et"}
                    onPress={handleNext}
                    disabled={!preferences[currentStep.id]}
                    loading={loading}
                    size="lg"
                    fullWidth
                    style={styles.nextButton}
                />
            </View>
        </SafeAreaView>
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
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    backButton: {
        padding: 8,
    },
    progressContainer: {
        flex: 1,
        height: 6,
        backgroundColor: theme.colors.gray200,
        borderRadius: 3,
        marginHorizontal: theme.spacing.lg,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
    },
    stepIndicator: {
        fontSize: theme.fontSize.xs,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
        letterSpacing: 1,
    },
    title: {
        fontSize: theme.fontSize['3xl'],
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.gray900,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.fontSize.base,
        color: theme.colors.gray500,
        marginBottom: theme.spacing['3xl'],
        lineHeight: 24,
    },
    optionsContainer: {
        gap: theme.spacing.md,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        borderWidth: 2,
        borderColor: 'transparent',
        ...theme.shadow.sm,
    },
    optionCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '05',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    iconContainerSelected: {
        backgroundColor: theme.colors.primary,
    },
    optionLabel: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.gray800,
        flex: 1,
    },
    optionLabelSelected: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.bold,
    },
    checkIcon: {
        marginLeft: theme.spacing.sm,
    },
    footer: {
        padding: theme.spacing.xl,
        paddingBottom: theme.spacing['4xl'],
    },
    nextButton: {
        borderRadius: theme.borderRadius.full,
    },
});
