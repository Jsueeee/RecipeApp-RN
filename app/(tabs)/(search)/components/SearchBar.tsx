import SearchBarIcon from "@/assets/images/ic_search_bar.svg";
import i18n from "@/lib/i18n";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { Keyboard, TextInput, View } from "react-native";

interface Props {
  keyword: string;
  onValueChange: (value: string) => void;
  onSearch: (keyword: string) => void;
  className?: string;
  disableAutoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<Props> = ({
  keyword,
  onValueChange,
  onSearch,
  className,
  disableAutoFocus = false,
  onFocus,
  onBlur,
}) => {
  const inputRef = useRef<TextInput>(null);
  const isFocused = useIsFocused();
  const hasAutoFocusedRef = useRef(false);
  const keywordRef = useRef(keyword);
  keywordRef.current = keyword;

  useEffect(() => {
    // 탭에서 벗어나면 다음 진입 때 다시 포커스할 수 있도록 리셋
    if (!isFocused) {
      hasAutoFocusedRef.current = false;
      return;
    }
    if (disableAutoFocus) return;
    if (hasAutoFocusedRef.current) return;
    if (keywordRef.current.trim()) return; // 검색어 있으면 자동 포커스 스킵

    hasAutoFocusedRef.current = true;
    const timer = setTimeout(() => inputRef.current?.focus(), 300);

    return () => {
      clearTimeout(timer);
      inputRef.current?.blur();
    };
  }, [disableAutoFocus, isFocused]);

  // 키보드 내려올 때
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        inputRef.current?.blur();
      },
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
          className="flex-1 text-utility2 min-h-[20px] leading-[17px] p-0"
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
            if (keyword.trim()) return;

            onBlur?.();
          }}
        />
      </View>
    </View>
  );
};
