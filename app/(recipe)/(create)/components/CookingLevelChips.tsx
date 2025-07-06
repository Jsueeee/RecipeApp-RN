import CookingLevel1Icon from "@/assets/images/ic_cooking_level_1.svg";
import CookingLevel2Icon from "@/assets/images/ic_cooking_level_2.svg";
import CookingLevel3Icon from "@/assets/images/ic_cooking_level_3.svg";
import i18n from "@/lib/i18n";
import clsx from "clsx";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
  cookingLevel: string;
  onChanged: (level: string) => void;
}

export const COOKING_LEVEL = [
  {
    key: "easy",
    label: i18n.t("recipe_cooking_level.easy"),
    Icon: CookingLevel1Icon,
  },
  {
    key: "normal",
    label: i18n.t("recipe_cooking_level.normal"),
    Icon: CookingLevel2Icon,
  },
  {
    key: "hard",
    label: i18n.t("recipe_cooking_level.hard"),
    Icon: CookingLevel3Icon,
  },
];

export const CookingLevelChips = ({ cookingLevel, onChanged }: Props) => {
  const selectedLevel = COOKING_LEVEL.find(
    (level) => level.key === cookingLevel
  );
  const selectedBgClassName = "bg-gray-50";
  const selectedTextClassName = "text-utility4 text-primary-normal";
  const unselectedTextClassName = "text-body4 text-text-assistive";
  const SelectedIcon = selectedLevel?.Icon;

  return (
    <View className="flex-row gap-x-1">
      {/* Icon */}
      {SelectedIcon && <SelectedIcon width={24} height={24} />}

      {/* Level */}
      {COOKING_LEVEL.map((level) => (
        <Pressable key={level.key} onPress={() => onChanged(level.key)}>
          <View
            className={clsx(
              "px-2 py-1.5 items-center justify-center rounded-[8px]",
              selectedLevel?.key === level.key
                ? selectedBgClassName
                : "bg-white"
            )}
          >
            <Text
              className={clsx(
                selectedLevel?.key === level.key
                  ? selectedTextClassName
                  : unselectedTextClassName
              )}
            >
              {level.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};
