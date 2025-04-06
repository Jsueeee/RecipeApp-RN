import React from "react";
import { View, Text } from "react-native";
import { RecipeProcess } from "@/app/types/domain/recipe";
import i18n from "@/lib/i18n";

interface CookingStepProps {
  stepNumber: number;
  stepDescription: string;
}

const CookingStep: React.FC<CookingStepProps> = ({
  stepNumber,
  stepDescription,
}) => {
  return (
    <View className="w-full bg-fill-subtle rounded-[12px] p-4">
      <View className="gap-y-2">
        <Text className="text-title4 text-primary-strong">
          {String(stepNumber).padStart(2, "0")}
        </Text>
        <Text className="text-body2 text-text-strong">{stepDescription}</Text>
      </View>
    </View>
  );
};

interface CookingStepsProps {
  stepInfo: RecipeProcess[];
  className?: string;
}

export const CookingSteps: React.FC<CookingStepsProps> = ({
  stepInfo,
  className,
}) => {
  return (
    <View className={className}>
      <Text className="text-title3 text-text-normal">
        {i18n.t("recipe_detail.cooking_step_title")}
      </Text>

      <View className="h-5" />

      <View className="gap-y-2">
        {stepInfo.map((step, index) => (
          <CookingStep
            key={step.id}
            stepNumber={step.no}
            stepDescription={step.description ?? ""}
          />
        ))}
      </View>
    </View>
  );
};
