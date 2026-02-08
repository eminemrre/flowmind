import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { theme } from '@/constants/theme';

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
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        styles[`text_${size}`],
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? '#fff' : theme.colors.primary}
                    size="small"
                />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: theme.colors.gray100,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    size_sm: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.base,
        minHeight: 36,
    },
    size_md: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 48,
    },
    size_lg: {
        paddingVertical: theme.spacing.base,
        paddingHorizontal: theme.spacing['2xl'],
        minHeight: 56,
    },

    fullWidth: {
        width: '100%',
    },

    disabled: {
        opacity: 0.5,
    },

    // Text styles
    text: {
        fontWeight: theme.fontWeight.semibold,
    },
    text_primary: {
        color: '#fff',
    },
    text_secondary: {
        color: theme.colors.gray700,
    },
    text_outline: {
        color: theme.colors.primary,
    },
    text_ghost: {
        color: theme.colors.primary,
    },
    text_sm: {
        fontSize: theme.fontSize.sm,
    },
    text_md: {
        fontSize: theme.fontSize.base,
    },
    text_lg: {
        fontSize: theme.fontSize.lg,
    },
});
