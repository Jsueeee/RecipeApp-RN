import { DebouncedTouchableOpacity } from "@/app/components/DebouncedPressable";
import { PressableScale } from "@/app/components/PressableScale";
import IC_PLUS from "@/assets/images/ic_plus_bold.svg";
import IC_DELETE from "@/assets/images/ic_selected_cancel.svg";
import i18n from "@/lib/i18n";
import { forwardRef, useEffect, useRef } from "react";
import { Text, TextInput, View } from "react-native";

interface CookingStepProps {
  stepNumber: number;
  stepDescription: string;
  onDeleteButtonPress?: (stepId: number) => void;
  onStepDescriptionChange?: (stepDescription: string) => void;
  onFocus?: () => void;
  onContentSizeChange?: () => void;
}

const CookingStepInput = forwardRef<TextInput, CookingStepProps>(
  (
    {
      stepNumber,
      stepDescription,
      onDeleteButtonPress,
      onStepDescriptionChange,
      onFocus,
      onContentSizeChange,
    },
    ref,
  ) => {
    return (
      <View className="w-full bg-fill-subtle rounded-[12px] p-4">
        <View className="gap-y-2 pb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-title4 text-primary-strong">
              {String(stepNumber).padStart(2, "0")}
            </Text>

            <DebouncedTouchableOpacity
              activeOpacity={0.8}
              onPress={() => onDeleteButtonPress?.(stepNumber)}
            >
              <IC_DELETE width={24} height={24} />
            </DebouncedTouchableOpacity>
          </View>

          <TextInput
            ref={ref}
            value={stepDescription}
            placeholder={i18n.t("recipe_my_create.cooking_step_input_hint")}
            multiline
            scrollEnabled={false}
            className="w-full text-body2 min-h-[20px] p-0"
            placeholderTextColor={"#A9A9A9"}
            textAlignVertical="top"
            onChangeText={(text) => onStepDescriptionChange?.(text)}
            onFocus={onFocus}
            onContentSizeChange={onContentSizeChange}
          />
        </View>
      </View>
    );
  },
);

CookingStepInput.displayName = "CookingStepInput";

const PlusButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <PressableScale onPress={onPress}>
      <View className="w-6 h-6 bg-primary-normal rounded-full items-center justify-center">
        <IC_PLUS width={8} height={8} color="white" />
      </View>
    </PressableScale>
  );
};

export const CookingStepInputs = ({
  stepInfo,
  className,
  onPlusButtonPress,
  onDeleteButtonPress,
  onStepDescriptionChange,
  onStepFocus,
  onStepContentSizeChange,
}: {
  stepInfo: string[];
  className?: string;
  onPlusButtonPress?: () => void;
  onDeleteButtonPress?: (stepId: number) => void;
  onStepDescriptionChange?: (
    stepIndex: number,
    stepDescription: string
  ) => void;
  onStepFocus?: (stepIndex: number) => void;
  onStepContentSizeChange?: () => void;
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const shouldFocusAddedStepRef = useRef(false);

  useEffect(() => {
    if (!shouldFocusAddedStepRef.current) return;

    shouldFocusAddedStepRef.current = false;
    const animationFrameId = requestAnimationFrame(() => {
      inputRefs.current[stepInfo.length - 1]?.focus();
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [stepInfo.length]);

  const handlePlusButtonPress = () => {
    if (!onPlusButtonPress) return;

    shouldFocusAddedStepRef.current = true;
    onPlusButtonPress();
  };

  return (
    <View className={`w-full ${className}`}>
      <Text className="text-title3 text-text-normal">
        {i18n.t("recipe_my_create.cooking_step_list_title")}
      </Text>

      <View className="h-5" />

      <View className="gap-y-2">
        {stepInfo.map((step, index) => (
          <CookingStepInput
            key={index}
            ref={(input) => {
              inputRefs.current[index] = input;
            }}
            stepNumber={index + 1}
            stepDescription={step}
            onDeleteButtonPress={() => onDeleteButtonPress?.(index)}
            onStepDescriptionChange={(stepDescription) =>
              onStepDescriptionChange?.(index, stepDescription)
            }
            onFocus={() => onStepFocus?.(index)}
            onContentSizeChange={onStepContentSizeChange}
          />
        ))}
      </View>

      <View className="h-6" />

      <View className="items-center">
        <PlusButton onPress={handlePlusButtonPress} />
      </View>
    </View>
  );
};
