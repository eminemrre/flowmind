import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, palette } from '@/constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

const sizeMap = {
    sm: { padV: theme.spacing.sm, padH: theme.spacing.base, font: theme.fontSize.sm, minH: 38 },
    md: { padV: theme.spacing.md, padH: theme.spacing.xl, font: theme.fontSize.base, minH: 48 },
    lg: { padV: theme.spacing.base, padH: theme.spacing['2xl'], font: theme.fontSize.lg, minH: 56 },
};

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
}: ButtonProps) {
    const isInactive = disabled || loading;
    const sz = sizeMap[size];

    // Primary = gradient brand button with glow
    if (variant === 'primary') {
        return (
            <Pressable
                onPress={onPress}
                disabled={isInactive}
                style={({ pressed }) => [
                    styles.shadow,
                    styles.glow,
                    fullWidth && styles.fullWidth,
                    pressed && !isInactive && styles.pressed,
                    style,
                ]}
            >
                <LinearGradient
                    colors={theme.gradients.brand}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.gradient,
                        { paddingVertical: sz.padV, paddingHorizontal: sz.padH, minHeight: sz.minH },
                        isInactive && styles.disabled,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={[styles.text, styles.textPrimary, { fontSize: sz.font }, textStyle]}>
                            {title}
                        </Text>
                    )}
                </LinearGradient>
            </Pressable>
        );
    }

    // Secondary = glass with subtle border
    // Outline = transparent with neon border
    // Ghost = pure text
    const variantStyle = styles[variant];
    const variantTextStyle = styles[`text_${variant}` as keyof typeof styles];

    return (
        <Pressable
            onPress={onPress}
            disabled={isInactive}
            style={({ pressed }) => [
                styles.base,
                variantStyle,
                { paddingVertical: sz.padV, paddingHorizontal: sz.padH, minHeight: sz.minH },
                fullWidth && styles.fullWidth,
                isInactive && styles.disabled,
                pressed && !isInactive && styles.pressed,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'ghost' ? palette.primary : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <Text style={[styles.text, variantTextStyle as TextStyle, { fontSize: sz.font }, textStyle]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    shadow: {
        borderRadius: theme.borderRadius.lg,
    },
    glow: {
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 18,
        elevation: 10,
    },
    gradient: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
    },

    // Variants (non-primary)
    secondary: {
        backgroundColor: palette.glassStrong,
        borderWidth: 1,
        borderColor: palette.glassBorder,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: palette.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    fullWidth: {
        width: '100%',
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.4,
    },

    // Text
    text: {
        fontWeight: theme.fontWeight.semibold,
        letterSpacing: 0.2,
    },
    textPrimary: {
        color: '#FFFFFF',
    },
    text_secondary: {
        color: '#FFFFFF',
    },
    text_outline: {
        color: palette.primaryLight,
    },
    text_ghost: {
        color: palette.primaryLight,
    },
});
