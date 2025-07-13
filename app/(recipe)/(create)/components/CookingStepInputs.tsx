import { PressableScale } from "@/app/components/PressableScale";
import IC_PLUS from "@/assets/images/ic_plus_bold.svg";
import IC_DELETE from "@/assets/images/ic_selected_cancel.svg";
import i18n from "@/lib/i18n";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CookingStepProps {
  stepNumber: number;
  stepDescription: string;
  onDeleteButtonPress?: (stepId: number) => void;
}

const CookingStepInput: React.FC<CookingStepProps> = ({
  stepNumber,
  stepDescription,
  onDeleteButtonPress,
}) => {
  return (
    <View className="w-full bg-fill-subtle rounded-[12px] p-4">
      <View className="gap-y-2">
        <Text className="text-title4 text-primary-strong">
          {String(stepNumber).padStart(2, "0")}
        </Text>

        <TextInput
          value={stepDescription}
          placeholder={i18n.t("recipe_my_create.cooking_step_input_hint")}
          multiline
          className="text-body2 text-text-normal pb-4"
          placeholderTextColor={"#A9A9A9"}
          textAlignVertical="top"
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={{ position: "absolute", right: 0, top: 0 }}
          onPress={() => onDeleteButtonPress?.(stepNumber)}
        >
          <IC_DELETE width={24} height={24} />
        </TouchableOpacity>
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
}: {
  stepInfo: string[];
  className?: string;
  onPlusButtonPress?: () => void;
  onDeleteButtonPress?: (stepId: number) => void;
}) => {
  return (
    <View className="w-full">
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
