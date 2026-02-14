import { PressableScale } from "@/app/components/PressableScale";
import IC_PLUS from "@/assets/images/ic_plus_bold.svg";
import IC_DELETE from "@/assets/images/ic_selected_cancel.svg";
import i18n from "@/lib/i18n";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CookingStepProps {
  stepNumber: number;
  stepDescription: string;
  onDeleteButtonPress?: (stepId: number) => void;
  onStepDescriptionChange?: (stepDescription: string) => void;
  onFocus?: () => void;
}

const CookingStepInput: React.FC<CookingStepProps> = ({
  stepNumber,
  stepDescription,
  onDeleteButtonPress,
  onStepDescriptionChange,
  onFocus,
}) => {
  return (
    <View className="w-full bg-fill-subtle rounded-[12px] p-4">
      <View className="gap-y-2 pb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-title4 text-primary-strong">
            {String(stepNumber).padStart(2, "0")}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onDeleteButtonPress?.(stepNumber)}
          >
            <IC_DELETE width={24} height={24} />
          </TouchableOpacity>
        </View>

        <TextInput
          value={stepDescription}
          placeholder={i18n.t("recipe_my_create.cooking_step_input_hint")}
          multiline
          className="flex-1 text-body2 min-h-[20px] leading-[17px] p-0"
          placeholderTextColor={"#A9A9A9"}
          textAlignVertical="top"
          onChangeText={(text) => onStepDescriptionChange?.(text)}
          onFocus={onFocus}
        />
      </View>
    </View>
  );
};

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
}) => {
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
            stepNumber={index + 1}
            stepDescription={step}
            onDeleteButtonPress={() => onDeleteButtonPress?.(index)}
            onStepDescriptionChange={(stepDescription) =>
              onStepDescriptionChange?.(index, stepDescription)
            }
            onFocus={() => onStepFocus?.(index)}
          />
        ))}
      </View>

      <View className="h-6" />

      <View className="items-center">
        <PlusButton onPress={() => onPlusButtonPress?.()} />
      </View>
    </View>
  );
};
