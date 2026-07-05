import { DebouncedGesturePressable } from "@/app/components/DebouncedPressable";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import { useLoginPrompt } from "@/app/hooks/useLoginPrompt";
import { TutorialAnchor } from "@/app/tutorial";
import CreateRecipeFabIcon from "@/assets/images/ic_create_recipe_fab.svg";
import { useRouter } from "expo-router";
import React from "react";

export function CreateRecipeButton() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();
  const promptLogin = useLoginPrompt();

  const onButtonPress = () => {
    if (!isAuthenticated) {
      promptLogin();
      return;
    }

    router.push("/(recipe)/(create)");
  };

  return (
    <TutorialAnchor
      id="my-recipe-create"
      style={{ position: "absolute", bottom: 80, right: 16 }}
    >
      <DebouncedGesturePressable
        onPress={onButtonPress}
        style={({ pressed }) => ({
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: pressed ? "#30C09C" : "#4BD2B0",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <CreateRecipeFabIcon width={20} height={20} />
      </DebouncedGesturePressable>
    </TutorialAnchor>
  );
}
