import { FreshnessLevel } from "@/app/types/domain/fridge";
import i18n from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  freshness: FreshnessLevel;
}

const freshnessText = {
  FRESH: i18n.t("freshness.fresh"),
  RISKY: i18n.t("freshness.risky"),
  SPOILED: i18n.t("freshness.spoiled"),
};

const freshnessBackgroundColor = {
  FRESH: "bg-status-positive",
  RISKY: "bg-status-cautionary",
  SPOILED: "bg-status-destructive",
};

const freshnessTextColor = {
  FRESH: "text-strong-positive",
  RISKY: "text-strong-cautionary",
  SPOILED: "text-strong-destructive",
};

export function FreshnessLabel({ freshness }: Props) {
  return (
    <View
      className={`px-[8px] py-[6px] rounded-lg ${freshnessBackgroundColor[freshness]}`}
    >
      <Text className={`text-utility4 ${freshnessTextColor[freshness]}`}>
        {freshnessText[freshness]}
      </Text>
    </View>
  );
}
