import React, { useRef } from "react";
import { FlatList, Pressable, Text, ViewToken } from "react-native";
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
  const flatListRef = useRef<FlatList>(null);

  const handleTabPress = (index: number) => {
    onSelectTabIndex(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5, // 선택된 항목을 중앙에 위치
    });
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable
      onPress={() => handleTabPress(index)}
      className={clsx(
        "px-3 py-[9px] rounded-full",
        index === selectedTabIndex ? "bg-primary-strong" : "bg-gray-100"
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
    </Pressable>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={tabs}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="bg-gray-100"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
    />
  );
}
