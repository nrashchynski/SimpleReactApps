import { useRef, useMemo } from 'react';
import { StyleSheet, Text, Pressable, Animated } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import type { ThemeColors } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AddTaskButtonProps = {
    onPress: () => void;
};

export default function AddTaskButton({ onPress }: AddTaskButtonProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 1.10,
            useNativeDriver: true,
            friction: 4,
            tension: 40,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 4,
            tension: 40,
        }).start();
    };

    return (
        <AnimatedPressable
            style={[styles.button, { transform: [{ scale: scaleAnim }] }]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel="Добавить задачу"
        >
            <Text style={styles.buttonText}>+</Text>
        </AnimatedPressable>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    button: {
        position: 'absolute',
        right: 20,
        bottom: 84,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: colors.border,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.accent,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 30,
        fontWeight: "500",
        color: colors.accentContrast,
    },
});
