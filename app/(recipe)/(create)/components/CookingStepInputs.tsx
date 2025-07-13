import { RecipeProcess } from "@/app/types/domain/recipe";
import i18n from "@/lib/i18n";
import { Text, TextInput, View } from "react-native";
import IC_DELETE from "@/assets/images/ic_selected_cancel.svg";
import IC_PLUS from "@/assets/images/ic_plus_bold.svg";
import { PressableScale } from "@/app/components/PressableScale";

interface CookingStepProps {
  stepNumber: number;
  stepDescription: string;
}

const CookingStepInput: React.FC<CookingStepProps> = ({
  stepNumber,
  stepDescription,
}) => {
  return (
    <View className="w-full bg-fill-subtle rounded-[12px] p-4">
      <View className="gap-y-2">
        <Text className="text-title4 text-primary-strong">
          {String(stepNumber).padStart(2, "0")}
        </Text>

        <TextInput
          placeholder={i18n.t("recipe_my_create.cooking_step_input_hint")}
          multiline
          className="text-body2 text-text-normal pb-4"
          placeholderTextColor={"#A9A9A9"}
          textAlignVertical="top"
        />

        <IC_DELETE
          width={24}
          height={24}
          style={{ position: "absolute", right: 0, top: 0 }}
        />
      </View>
    </View>
  );
};

const PlusButton = () => {
  return (
    <PressableScale
      onPress={() => {
        console.log("PlusButton");
      }}
    >
      <View className="w-6 h-6 bg-primary-normal rounded-full items-center justify-center">
        <IC_PLUS width={8} height={8} color="white" />
      </View>
    </PressableScale>
  );
};

export const CookingStepInputs = ({
  stepInfo,
  className,
}: {
  stepInfo: RecipeProcess[];
  className?: string;
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
            key={step.id}
            stepNumber={step.no}
            stepDescription={step.description ?? ""}
          />
        ))}
      </View>

      <View className="h-6" />

      <View className="items-center">
        <PlusButton />
      </View>
    </View>
  );
};
