import { useDebouncedPress } from "@/app/hooks/useDebouncedPress";
import { useRef } from "react";
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  ViewStyle,
} from "react-native";

interface PressableScaleProps {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  pressedStyle?: ViewStyle;
  disabled?: boolean;
  hitSlop?: number;
  onLayout?: (e: LayoutChangeEvent) => void;
  debounceDelay?: number;
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
  debounceDelay,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const debouncedOnPress =
    useDebouncedPress<[GestureResponderEvent]>(onPress, debounceDelay);

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
      onPress={debouncedOnPress}
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
