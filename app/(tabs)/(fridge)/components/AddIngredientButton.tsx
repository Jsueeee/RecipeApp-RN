import { TutorialAnchor, useTutorial } from "@/app/tutorial";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export function AddIngredientButton() {
  const {
    currentStep,
    reportAnchorTap,
    registerAnchorAction,
    state,
    triggerAnchorAction,
  } = useTutorial();

  const openPicker = useCallback(() => {
    router.push("/(ingredient)/(pick)");
  }, []);

  useEffect(() => {
    registerAnchorAction("fab-add-ingredient", openPicker);
  }, [openPicker, registerAnchorAction]);

  const onPress = () => {
    reportAnchorTap("fab-add-ingredient");
    if (
      state.phase === "waiting" &&
      currentStep?.anchorId === "fab-add-ingredient"
    ) {
      triggerAnchorAction("fab-add-ingredient");
      return;
    }
    openPicker();
  };

  return (
    <TutorialAnchor id="fab-add-ingredient" style={styles.position}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? "#30C09C" : "#4BD2B0" },
        ]}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </Pressable>
    </TutorialAnchor>
  );
}

const styles = StyleSheet.create({
  position: {
    position: "absolute",
    bottom: 80,
    right: 16,
    width: 48,
    height: 48,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
