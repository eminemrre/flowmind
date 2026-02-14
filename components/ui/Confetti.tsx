import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    runOnJS,
    Easing,
    withSequence
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface ParticleProps {
    x: number;
    y: number;
    color: string;
    delay: number;
    onComplete: () => void;
}

const Particle = ({ x, y, color, delay, onComplete }: ParticleProps) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    useEffect(() => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 150;
        const targetX = Math.cos(angle) * velocity;
        const targetY = Math.sin(angle) * velocity;

        translateX.value = withDelay(delay, withTiming(targetX, { duration: 800, easing: Easing.out(Easing.cubic) }));
        translateY.value = withDelay(delay, withTiming(targetY + 200, { duration: 800, easing: Easing.out(Easing.cubic) })); // Falls down
        rotation.value = withDelay(delay, withTiming(Math.random() * 360, { duration: 800 }));
        opacity.value = withDelay(delay, withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0, { duration: 200 }, (finished) => {
                if (finished) {
                    runOnJS(onComplete)();
                }
            })
        ));
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` },
            { scale: scale.value }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                { left: x, top: y, backgroundColor: color },
                style
            ]}
        />
    );
};

interface ConfettiProps {
    x: number;
    y: number;
    count?: number;
    onAnimationComplete?: () => void;
}

export function Confetti({ x, y, count = 20, onAnimationComplete }: ConfettiProps) {
    const [completedCount, setCompletedCount] = React.useState(0);
    const colors = [theme.colors.primary, theme.colors.success, theme.colors.warning, theme.colors.info, '#FF6B6B', '#4ECDC4'];

    const handleComplete = () => {
        const newCount = completedCount + 1;
        setCompletedCount(newCount);
        if (newCount >= count && onAnimationComplete) {
            onAnimationComplete();
        }
    };

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: count }).map((_, i) => (
                <Particle
                    key={i}
                    x={x}
                    y={y}
                    color={colors[Math.floor(Math.random() * colors.length)]}
                    delay={i * 10}
                    onComplete={handleComplete}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
