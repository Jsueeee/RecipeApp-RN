import SearchBarIcon from "@/assets/images/ic_search_bar.svg";
import i18n from "@/lib/i18n";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Keyboard, TextInput, View } from "react-native";

interface Props {
  keyword: string;
  onValueChange: (value: string) => void;
  onSearch: (keyword: string) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<Props> = ({
  keyword,
  onValueChange,
  onSearch,
  className,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      return () => {
        inputRef.current?.blur();
        cancelAnimationFrame(id);
      };
    }, [])
  );

  // 키보드 내려올 때
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        inputRef.current?.blur();
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <View className={className}>
      <View className="flex-row items-center bg-[#F1F3F2] rounded-[12px] py-2.5 px-3 gap-1">
        <SearchBarIcon width={20} height={20} />

        <TextInput
          ref={inputRef}
          value={keyword}
          onChangeText={onValueChange}
          className="flex-1 text-utility2 text-text-strong p-0"
          placeholder={i18n.t("search.search_bar_hint")}
          placeholderTextColor="#BAC4BF"
          returnKeyType="search"
          selectTextOnFocus
          selectionColor="#BAC4BF"
          cursorColor="#BAC4BF"
          editable={true}
          onSubmitEditing={() => {
            onSearch(keyword);
          }}
          onFocus={() => {
            onFocus?.();
          }}
          onBlur={() => {
            onBlur?.();
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};
