import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import React, { useRef } from "react";
import { Text, View } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import clsx from "clsx";

interface Props {
  tabs: string[];
  selectedTabIndex: number;
  onSelectTabIndex: (index: number) => void;
  className?: string;
}

export function CategoryTabs({
  tabs,
  selectedTabIndex,
  onSelectTabIndex,
  className,
}: Props) {
  const flatListRef = useRef<FlashListRef<string>>(null);

  const handleTabPress = (index: number) => {
    onSelectTabIndex(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // 선택된 항목을 중앙에 위치
    });
  };
  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <DebouncedPressable
      onPress={() => handleTabPress(index)}
      className={clsx(
        "px-3 py-[9px] rounded-full",
        index === selectedTabIndex ? "bg-primary-strong" : undefined
      )}
    >
      <Text
        className={clsx(
          index === selectedTabIndex
            ? "text-utility3 text-white"
            : "text-utility2 text-text-normal"
        )}
      >
        {item}
      </Text>
    </DebouncedPressable>
  );

  return (
    <View className={className}>
      <FlashList
        ref={flatListRef}
        data={tabs}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      />
    </View>
  );
}
