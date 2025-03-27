import React from "react";
import { ScrollView, Pressable, Text } from "react-native";
import clsx from "clsx";

interface Props {
  tabs: string[];
  selectedTabIndex: number;
  onSelectTabIndex: (index: number) => void;
}

export function CategoryTabs({
  tabs,
  selectedTabIndex,
  onSelectTabIndex,
}: Props) {
  return (
    <ScrollView
      horizontal
      className="bg-gray-100 px-4 py-3"
      showsHorizontalScrollIndicator={false}
    >
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          onPress={() => onSelectTabIndex(index)}
          className={`px-3 py-[9px] rounded-full ${
            index === selectedTabIndex ? "bg-primary-strong" : "bg-gray-100"
          }`}
        >
          <Text
            className={clsx(
              index === selectedTabIndex
                ? ["text-utility3 text-white"]
                : ["text-utility2 text-text-normal"]
            )}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
