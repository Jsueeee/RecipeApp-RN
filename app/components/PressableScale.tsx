import { useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  ViewStyle,
} from "react-native";

interface PressableScaleProps {
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  pressedStyle?: ViewStyle;
  disabled?: boolean;
  hitSlop?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
}

export const PressableScale: React.FC<PressableScaleProps> = ({
  onPress,
  children,
  className,
  style,
  pressedStyle,
  disabled = false,
  hitSlop = 0,
  onLayout,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        speed: 20,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 20,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 20,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
      className={className}
      hitSlop={hitSlop}
      onLayout={onLayout}
    >
      {({ pressed }) => (
        <Animated.View
          style={[
            style,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
            pressed && pressedStyle,
          ]}
        >
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
};
