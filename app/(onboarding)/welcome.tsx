import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';

const questions = [
    { id: 1, question: 'Sabahçı mısın, akşamcı mı?', options: ['🌅 Sabahçıyım', '🌙 Akşamcıyım', '⚖️ İkisi arası'] },
    { id: 2, question: 'Günde kaç saat çalışıyorsun?', options: ['4-6 saat', '6-8 saat', '8+ saat'] },
    { id: 3, question: 'En büyük zorluğun ne?', options: ['Odaklanmak', 'Zaman yönetimi', 'Motivasyon'] },
];

export default function WelcomeScreen() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const { setOnboardingComplete, setPreferences } = useAuthStore();

    const handleSelect = (option: string) => {
        setAnswers({ ...answers, [questions[step].id]: option });
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setOnboardingComplete(true);
            router.replace('/(tabs)');
        }
    };

    const currentQuestion = questions[step];
    const selectedOption = answers[currentQuestion.id];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Progress */}
                <View style={styles.progressContainer}>
                    {questions.map((_, i) => (
                        <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
                    ))}
                </View>

                {/* Welcome on first step */}
                {step === 0 && (
                    <View style={styles.welcomeHeader}>
                        <Text style={styles.emoji}>🧠</Text>
                        <Text style={styles.welcomeTitle}>Hoş Geldin!</Text>
                        <Text style={styles.welcomeSubtitle}>Seni tanıyalım ki daha iyi öneriler sunalım</Text>
                    </View>
                )}

                {/* Question */}
                <Text style={styles.question}>{currentQuestion.question}</Text>

                {/* Options */}
                <View style={styles.options}>
                    {currentQuestion.options.map((option, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.option, selectedOption === option && styles.optionSelected]}
                            onPress={() => handleSelect(option)}
                        >
                            <Text style={[styles.optionText, selectedOption === option && styles.optionTextSelected]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Continue Button */}
                <Button
                    title={step === questions.length - 1 ? 'Başlayalım! 🚀' : 'Devam'}
                    onPress={handleNext}
                    disabled={!selectedOption}
                    fullWidth
                    size="lg"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, padding: theme.spacing.xl, justifyContent: 'center' },
    progressContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: theme.spacing['2xl'], gap: theme.spacing.sm },
    progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.gray200 },
    progressDotActive: { backgroundColor: theme.colors.primary },
    welcomeHeader: { alignItems: 'center', marginBottom: theme.spacing['2xl'] },
    emoji: { fontSize: 64, marginBottom: theme.spacing.md },
    welcomeTitle: { fontSize: theme.fontSize['2xl'], fontWeight: theme.fontWeight.bold, color: theme.colors.gray900 },
    welcomeSubtitle: { fontSize: theme.fontSize.base, color: theme.colors.gray500, textAlign: 'center' },
    question: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.semibold, color: theme.colors.gray800, textAlign: 'center', marginBottom: theme.spacing.xl },
    options: { marginBottom: theme.spacing['2xl'] },
    option: { backgroundColor: theme.colors.gray50, borderWidth: 2, borderColor: theme.colors.gray200, borderRadius: theme.borderRadius.lg, padding: theme.spacing.base, marginBottom: theme.spacing.md, alignItems: 'center' },
    optionSelected: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' },
    optionText: { fontSize: theme.fontSize.base, color: theme.colors.gray700 },
    optionTextSelected: { color: theme.colors.primary, fontWeight: theme.fontWeight.semibold },
});
