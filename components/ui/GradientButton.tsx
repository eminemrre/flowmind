import React from 'react';
import { Pressable, Text, StyleSheet, View, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, palette } from '@/constants/theme';

type Variant = 'brand' | 'cyber' | 'sunset' | 'success' | 'danger' | 'aurora' | 'glass';
type Size = 'sm' | 'md' | 'lg';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    glow?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const variantToGradient = {
    brand: theme.gradients.brand,
    cyber: theme.gradients.cyber,
    sunset: theme.gradients.sunset,
    success: theme.gradients.success,
    danger: theme.gradients.danger,
    aurora: theme.gradients.aurora,
    glass: theme.gradients.glassCard,
} as const;

const sizeMap = {
    sm: { padV: theme.spacing.sm, padH: theme.spacing.base, font: theme.fontSize.sm, minH: 38 },
    md: { padV: theme.spacing.md, padH: theme.spacing.xl, font: theme.fontSize.base, minH: 48 },
    lg: { padV: theme.spacing.base, padH: theme.spacing['2xl'], font: theme.fontSize.lg, minH: 56 },
};

export function GradientButton({
    title,
    onPress,
    variant = 'brand',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon,
    glow = true,
    style,
    textStyle,
}: GradientButtonProps) {
    const isInactive = disabled || loading;
    const colors = variantToGradient[variant];
    const sz = sizeMap[size];
    const isGlass = variant === 'glass';

    return (
        <Pressable
            onPress={onPress}
            disabled={isInactive}
            style={({ pressed }) => [
                styles.shadow,
                glow && !isGlass && styles.glow,
                glow && !isGlass && { shadowColor: colors[0] },
                fullWidth && styles.fullWidth,
                pressed && !isInactive && styles.pressed,
                style,
            ]}
        >
            <LinearGradient
                colors={colors as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradient,
                    { paddingVertical: sz.padV, paddingHorizontal: sz.padH, minHeight: sz.minH },
                    isGlass && styles.glassBorder,
                    isInactive && styles.disabled,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon && <View style={styles.icon}>{icon}</View>}
                        <Text style={[styles.text, { fontSize: sz.font }, textStyle]}>{title}</Text>
                    </View>
                )}
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    shadow: {
        borderRadius: theme.borderRadius.lg,
    },
    glow: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 18,
        elevation: 10,
    },
    fullWidth: {
        width: '100%',
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    gradient: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    glassBorder: {
        borderWidth: 1,
        borderColor: palette.glassBorder,
    },
    disabled: {
        opacity: 0.4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: theme.fontWeight.semibold,
        letterSpacing: 0.2,
    },
});
