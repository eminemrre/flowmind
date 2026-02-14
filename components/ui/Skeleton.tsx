import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    interpolate,
} from 'react-native-reanimated';

interface SkeletonProps {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: any;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0, { duration: 1000 })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
    }));

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: '#334155',
                },
                animatedStyle,
                style,
            ]}
        />
    );
}

interface CardSkeletonProps {
    lines?: number;
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
    return (
        <View style={skStyles.card}>
            <Skeleton width="60%" height={20} style={{ marginBottom: 12 }} />
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '40%' : '100%'}
                    height={14}
                    style={{ marginBottom: 8 }}
                />
            ))}
        </View>
    );
}

export function StatsGridSkeleton() {
    return (
        <View style={skStyles.grid}>
            {[1, 2, 3, 4].map((i) => (
                <View key={i} style={skStyles.gridItem}>
                    <Skeleton width={48} height={48} borderRadius={24} style={{ marginBottom: 8 }} />
                    <Skeleton width={60} height={14} />
                </View>
            ))}
        </View>
    );
}

const skStyles = StyleSheet.create({
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 12,
    },
});
