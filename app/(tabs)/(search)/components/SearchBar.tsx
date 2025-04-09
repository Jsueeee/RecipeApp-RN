import SearchBarIcon from "@/assets/images/ic_search_bar.svg";
import i18n from "@/lib/i18n";
import React from "react";
import { TextInput, View } from "react-native";

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
  return (
    <View className={className}>
      <View className="flex-row items-center bg-[#F1F3F2] rounded-[12px] py-2.5 px-3 gap-1">
        <SearchBarIcon width={20} height={20} />

        <TextInput
          value={keyword}
          onChangeText={onValueChange}
          className="flex-1 text-utility2 text-text-strong p-0"
          placeholder={i18n.t("search.search_bar_hint")}
          placeholderTextColor="#BAC4BF"
          returnKeyType="search"
          selectTextOnFocus
          selectionColor="transparent"
          editable={true}
          caretHidden={true}
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
