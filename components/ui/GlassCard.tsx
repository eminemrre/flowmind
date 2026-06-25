import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, palette } from '@/constants/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
    glow?: 'indigo' | 'pink' | 'cyan' | 'none';
    bordered?: boolean;
    padding?: keyof typeof theme.spacing;
}

const glowColorMap = {
    indigo: theme.glows.indigo,
    pink: theme.glows.pink,
    cyan: theme.glows.cyan,
    none: {},
};

export function GlassCard({
    children,
    style,
    intensity = 30,
    glow = 'none',
    bordered = true,
    padding = 'lg',
}: GlassCardProps) {
    const glowStyle = glowColorMap[glow];
    const padValue = theme.spacing[padding];

    return (
        <View style={[styles.wrapper, glowStyle, style]}>
            <BlurView intensity={intensity} tint="dark" style={styles.blur}>
                <LinearGradient
                    colors={theme.gradients.glassCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.gradient,
                        { padding: padValue },
                        bordered && styles.bordered,
                    ]}
                >
                    {children}
                </LinearGradient>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
    blur: {
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
    },
    gradient: {
        borderRadius: theme.borderRadius.xl,
    },
    bordered: {
        borderWidth: 1,
        borderColor: palette.glassBorder,
    },
});
