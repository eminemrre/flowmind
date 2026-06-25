import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface GlowOrbProps {
    color?: 'indigo' | 'pink' | 'cyan' | 'violet';
    size?: number;
    opacity?: number;
    style?: StyleProp<ViewStyle>;
}

const colorMap = {
    indigo: ['#6366F1', 'rgba(99, 102, 241, 0)'] as const,
    pink: ['#EC4899', 'rgba(236, 72, 153, 0)'] as const,
    cyan: ['#06B6D4', 'rgba(6, 182, 212, 0)'] as const,
    violet: ['#8B5CF6', 'rgba(139, 92, 246, 0)'] as const,
};

/**
 * Ambient radial-glow orb for cybermorphism backgrounds.
 * Place with absolute positioning behind content.
 *
 * Example:
 *   <GlowOrb color="indigo" size={400} style={{ top: -100, left: -50 }} />
 */
export function GlowOrb({
    color = 'indigo',
    size = 300,
    opacity = 0.4,
    style,
}: GlowOrbProps) {
    const colors = colorMap[color];

    return (
        <View
            pointerEvents="none"
            style={[
                styles.container,
                { width: size, height: size, opacity },
                style,
            ]}
        >
            <LinearGradient
                colors={colors as readonly [string, string]}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 1, y: 1 }}
                style={[styles.orb, { width: size, height: size, borderRadius: size / 2 }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    orb: {
        // Radial gradient simulation via LinearGradient on a circular View
    },
});
