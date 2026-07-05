import { useDebouncedPress } from "@/app/hooks/useDebouncedPress";
import React, { useCallback } from "react";
import {
  GestureResponderEvent,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Pressable as GesturePressable } from "react-native-gesture-handler";

type NullablePressHandler<TEvent> =
  | ((event: TEvent) => void)
  | null
  | undefined;

interface DebounceProps<TEvent> {
  debounceDelay?: number;
  disablePressDebounce?: boolean;
  onPressBeforeDebounce?: (event: TEvent) => void;
}

const useDebouncedPressHandler = <TEvent,>(
  onPress: NullablePressHandler<TEvent>,
  debounceDelay: number | undefined,
  disablePressDebounce: boolean | undefined,
  onPressBeforeDebounce: ((event: TEvent) => void) | undefined,
) => {
  const debouncedOnPress = useDebouncedPress<[TEvent]>(
    onPress ?? undefined,
    debounceDelay,
  );

  return useCallback(
    (event: TEvent) => {
      onPressBeforeDebounce?.(event);

      if (disablePressDebounce) {
        onPress?.(event);
        return;
      }

      debouncedOnPress(event);
    },
    [
      debouncedOnPress,
      disablePressDebounce,
      onPress,
      onPressBeforeDebounce,
    ],
  );
};

type DebouncedPressableProps = React.ComponentProps<typeof Pressable> &
  DebounceProps<GestureResponderEvent>;

export function DebouncedPressable({
  onPress,
  debounceDelay,
  disablePressDebounce,
  onPressBeforeDebounce,
  ...props
}: DebouncedPressableProps) {
  const handlePress = useDebouncedPressHandler(
    onPress,
    debounceDelay,
    disablePressDebounce,
    onPressBeforeDebounce,
  );

  return <Pressable {...props} onPress={onPress ? handlePress : undefined} />;
}

type DebouncedTouchableOpacityProps = React.ComponentProps<
  typeof TouchableOpacity
> &
  DebounceProps<GestureResponderEvent>;

export function DebouncedTouchableOpacity({
  onPress,
  debounceDelay,
  disablePressDebounce,
  onPressBeforeDebounce,
  ...props
}: DebouncedTouchableOpacityProps) {
  const handlePress = useDebouncedPressHandler(
    onPress,
    debounceDelay,
    disablePressDebounce,
    onPressBeforeDebounce,
  );

  return (
    <TouchableOpacity {...props} onPress={onPress ? handlePress : undefined} />
  );
}

type DebouncedGesturePressableProps = React.ComponentProps<
  typeof GesturePressable
> &
  DebounceProps<
    Parameters<
      NonNullable<React.ComponentProps<typeof GesturePressable>["onPress"]>
    >[0]
  >;

export function DebouncedGesturePressable({
  onPress,
  debounceDelay,
  disablePressDebounce,
  onPressBeforeDebounce,
  ...props
}: DebouncedGesturePressableProps) {
  const handlePress = useDebouncedPressHandler(
    onPress,
    debounceDelay,
    disablePressDebounce,
    onPressBeforeDebounce,
  );

  return (
    <GesturePressable {...props} onPress={onPress ? handlePress : undefined} />
  );
}
