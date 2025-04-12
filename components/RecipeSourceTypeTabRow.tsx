import { RecipeSourceType } from "@/constants/RecipeSourceType";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface Props {
  tabs: readonly RecipeSourceType[];
  selectedTab: RecipeSourceType;
  onTabSelected: (tab: RecipeSourceType) => void;
}

export function RecipeSourceTypeTabRow({
  tabs,
  selectedTab,
  onTabSelected,
}: Props) {
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const tabWidth = width / tabs.length;

  useEffect(() => {
    const selectedIndex = tabs.indexOf(selectedTab);
    Animated.timing(indicatorPosition, {
      toValue: selectedIndex,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedTab, tabs]);

  return (
    <View className="w-full bg-white mt-2">
      <View className="flex-row border-b border-gray-100">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            className="flex-1 items-center py-3"
            onPress={() => onTabSelected(tab)}
          >
            <Text
              className={`text-title5 ${
                selectedTab === tab ? "text-text-strong" : "text-text-assistive"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          className="absolute bottom-0 h-0.5 bg-gray-800 rounded-lg"
          style={{
            width: tabWidth - 32,
            marginHorizontal: 16,
            transform: [
              {
                translateX: indicatorPosition.interpolate({
                  inputRange: [0, tabs.length - 1],
                  outputRange: [0, (tabs.length - 1) * tabWidth],
                }),
              },
            ],
          }}
        />
      </View>
    </View>
  );
}
